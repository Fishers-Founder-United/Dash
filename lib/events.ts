import type { DashboardData, Event, Spotlight, Announcement, NewsItem, StatsData, Photo } from "./types";
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

async function fetchSingleJson<T>(url: string, fallback: T | null): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const ts = Date.now();

  const [externalEvents, localEvents, spotlights, allAnnouncements, news, stats, photos] =
    await Promise.all([
      fetchJson<Event>(publicUrl(`/data/events.json?t=${ts}`), []),
      fetchJson<Event>(publicUrl(`/data/local-events.json?t=${ts}`), []),
      fetchJson<Spotlight>(publicUrl(`/data/spotlights.json?t=${ts}`), []),
      fetchJson<Announcement>(publicUrl(`/data/announcements.json?t=${ts}`), []),
      fetchJson<NewsItem>(publicUrl(`/data/news.json?t=${ts}`), []),
      fetchSingleJson<StatsData>(publicUrl(`/data/stats.json?t=${ts}`), null),
      fetchJson<Photo>(publicUrl(`/data/photos.json?t=${ts}`), []),
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

  return { events, spotlights, announcements, news, stats, photos };
}
