import type { DashboardData, Event, Spotlight, Announcement, NewsItem } from "./types";
import { publicUrl } from "./basepath";

async function fetchJson<T>(url: string, fallback: T[]): Promise<T[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T[];
  } catch {
    return fallback;
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const ts = Date.now();

  const [externalEvents, localEvents, spotlights, allAnnouncements, news] =
    await Promise.all([
      fetchJson<Event>(publicUrl(`/data/events.json?t=${ts}`), []),
      fetchJson<Event>(publicUrl(`/data/local-events.json?t=${ts}`), []),
      fetchJson<Spotlight>(publicUrl(`/data/spotlights.json?t=${ts}`), []),
      fetchJson<Announcement>(publicUrl(`/data/announcements.json?t=${ts}`), []),
      fetchJson<NewsItem>(publicUrl(`/data/news.json?t=${ts}`), []),
    ]);

  const today = new Date().toISOString().split("T")[0];

  const events = [...externalEvents, ...localEvents]
    .filter((e) => e.date >= today)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (a.time ?? "00:00").localeCompare(b.time ?? "00:00")
    );

  const announcements = allAnnouncements.filter(
    (a) => !a.expires || a.expires >= today
  );

  return { events, spotlights, announcements, news };
}
