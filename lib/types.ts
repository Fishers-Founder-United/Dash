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
  logo?: string;
  category?: string;
  newMember?: boolean;
}

export interface StatsData {
  members: number;
  squareFeet: number;
  companiesLaunched: number;
  jobsCreated: number;
  yearFounded: number;
}

export interface Photo {
  id: string;
  src: string;
  caption: string;
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

export interface FeaturedEvent {
  id: string;
  title: string;
  subtitle?: string;
  date: string;       // YYYY-MM-DD
  time?: string;      // HH:MM 24h
  location?: string;
  description?: string;
  image?: string;     // path relative to public/
  poster?: boolean;   // true = image contains all info, show full-bleed with no text overlay
  url?: string;
  expires?: string;   // YYYY-MM-DD — auto-hide after this date
}

export interface DashboardData {
  events: Event[];
  spotlights: Spotlight[];
  announcements: Announcement[];
  news: NewsItem[];
  stats: StatsData | null;
  photos: Photo[];
  featuredEvents: FeaturedEvent[];
}
