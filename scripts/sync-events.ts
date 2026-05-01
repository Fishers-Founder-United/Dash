/**
 * sync-events.ts
 *
 * Fetches events from external sources (Google Calendar, Eventbrite, Meetup)
 * and writes the merged result to public/data/events.json.
 *
 * Run via: npx tsx scripts/sync-events.ts
 *
 * Required environment variables (set as GitHub Actions Secrets):
 *   GOOGLE_CALENDAR_ICAL_URL   – Public iCal URL from Google Calendar
 *   EVENTBRITE_API_TOKEN       – Eventbrite private token
 *   EVENTBRITE_ORG_ID          – Your Eventbrite organization ID
 *   MEETUP_GROUP_URLNAMES      – Comma-separated Meetup group slugs
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import ical from "node-ical";
import type { Event } from "../lib/types";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/events.json");

// ─── Google Calendar (iCal) ──────────────────────────────────────────────────

async function fetchGoogleCalendarEvents(): Promise<Event[]> {
  const url = process.env.GOOGLE_CALENDAR_ICAL_URL;
  if (!url) {
    console.log("GOOGLE_CALENDAR_ICAL_URL not set, skipping.");
    return [];
  }

  try {
    const data = await ical.async.fromURL(url);
    const today = new Date().toISOString().split("T")[0];
    const events: Event[] = [];

    for (const item of Object.values(data)) {
      if (!item || item.type !== "VEVENT") continue;

      const start = item.start as Date;
      if (!start) continue;

      const dateStr = start.toISOString().split("T")[0];
      if (dateStr < today) continue;

      const timeStr =
        item.datetype === "date"
          ? undefined
          : `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;

      events.push({
        id: `google-${item.uid ?? dateStr + item.summary}`,
        title: String(item.summary ?? "Untitled Event"),
        date: dateStr,
        time: timeStr,
        location: item.location ? String(item.location) : undefined,
        description: item.description
          ? String(item.description).slice(0, 200)
          : undefined,
        url: item.url ? String(item.url) : undefined,
        source: "google",
        tags: [],
      });
    }

    console.log(`Fetched ${events.length} events from Google Calendar.`);
    return events;
  } catch (err) {
    console.error("Google Calendar fetch failed:", err);
    return [];
  }
}

// ─── Eventbrite ──────────────────────────────────────────────────────────────

async function fetchEventbriteEvents(): Promise<Event[]> {
  const token = process.env.EVENTBRITE_API_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID;

  if (!token || !orgId) {
    console.log("Eventbrite credentials not set, skipping.");
    return [];
  }

  try {
    const url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc&expand=venue`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Eventbrite API: ${res.status}`);

    const body = (await res.json()) as {
      events: Array<{
        id: string;
        name: { text: string };
        start: { local: string };
        venue?: { name?: string; address?: { localized_address_display?: string } };
        url?: string;
        description?: { text?: string };
      }>;
    };

    const today = new Date().toISOString().split("T")[0];

    const events: Event[] = (body.events ?? [])
      .map((e) => {
        const startLocal = e.start?.local ?? "";
        const [date, timeRaw] = startLocal.split("T");
        return {
          id: `eventbrite-${e.id}`,
          title: e.name?.text ?? "Eventbrite Event",
          date,
          time: timeRaw ? timeRaw.slice(0, 5) : undefined,
          location:
            e.venue?.name ??
            e.venue?.address?.localized_address_display ??
            undefined,
          description: e.description?.text?.slice(0, 200) ?? undefined,
          url: e.url ?? undefined,
          source: "eventbrite" as const,
          tags: [],
        };
      })
      .filter((e) => e.date >= today);

    console.log(`Fetched ${events.length} events from Eventbrite.`);
    return events;
  } catch (err) {
    console.error("Eventbrite fetch failed:", err);
    return [];
  }
}

// ─── Meetup ──────────────────────────────────────────────────────────────────

async function fetchMeetupEvents(): Promise<Event[]> {
  const groupNames = process.env.MEETUP_GROUP_URLNAMES;
  if (!groupNames) {
    console.log("MEETUP_GROUP_URLNAMES not set, skipping.");
    return [];
  }

  const groups = groupNames.split(",").map((g) => g.trim());
  const today = new Date().toISOString().split("T")[0];
  const events: Event[] = [];

  for (const group of groups) {
    try {
      // Meetup public API (no auth needed for public groups)
      const url = `https://api.meetup.com/${group}/events?status=upcoming&page=10`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Meetup fetch for ${group}: ${res.status}`);
        continue;
      }

      const body = (await res.json()) as Array<{
        id: string;
        name: string;
        local_date: string;
        local_time?: string;
        venue?: { name?: string; city?: string };
        link?: string;
        description?: string;
      }>;

      for (const e of body) {
        if (!e.local_date || e.local_date < today) continue;
        events.push({
          id: `meetup-${e.id}`,
          title: e.name,
          date: e.local_date,
          time: e.local_time ?? undefined,
          location: e.venue?.name ?? e.venue?.city ?? undefined,
          description: e.description
            ? e.description.replace(/<[^>]+>/g, "").slice(0, 200)
            : undefined,
          url: e.link ?? undefined,
          source: "meetup",
          tags: [],
        });
      }
    } catch (err) {
      console.error(`Meetup fetch for ${group} failed:`, err);
    }
  }

  console.log(`Fetched ${events.length} events from Meetup.`);
  return events;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Syncing external events...");

  const [gcal, eventbrite, meetup] = await Promise.all([
    fetchGoogleCalendarEvents(),
    fetchEventbriteEvents(),
    fetchMeetupEvents(),
  ]);

  const today = new Date().toISOString().split("T")[0];

  const all = [...gcal, ...eventbrite, ...meetup]
    .filter((e) => e.date >= today)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time ?? "00:00").localeCompare(b.time ?? "00:00")
    );

  // De-duplicate by title+date
  const seen = new Set<string>();
  const deduped = all.filter((e) => {
    const key = `${e.date}-${e.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  writeFileSync(OUTPUT_PATH, JSON.stringify(deduped, null, 2));
  console.log(
    `Done. Wrote ${deduped.length} events to public/data/events.json`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
