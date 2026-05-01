export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD — used for sorting; if recurrence is set, date is not displayed
  time?: string; // HH:MM 24h
  recurrence?: string; // human-readable recurrence label, e.g. "Mon–Thu · 12:15 PM"
  location?: string;
  description?: string;
  url?: string;
  source: "local" | "google" | "eventbrite" | "meetup" | "demo" | "launchfishers" | "mutiny19";
  tags?: string[];
}

export interface Spotlight {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website?: string;
  tags?: string[];
}

export interface Announcement {
  id: string;
  text: string;
  url?: string;
  expires?: string; // YYYY-MM-DD
}

export interface ForecastDay {
  label: string; // "Today", "Tomorrow", "Mon", etc.
  weatherCode: number;
  high: number;
  low: number;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  weatherCode: number;
  description: string;
  high: number;
  low: number;
  forecast: ForecastDay[];
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: "insideindiana" | "ibj";
  sourceLabel: string;
  publishedAt?: string; // ISO date string
  description?: string;
}

export interface DashboardData {
  events: Event[];
  spotlights: Spotlight[];
  announcements: Announcement[];
  news: NewsItem[];
}
