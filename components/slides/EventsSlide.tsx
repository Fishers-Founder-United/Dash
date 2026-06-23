"use client";

import { useAutoScroll } from "@/lib/useAutoScroll";
import type { Event } from "@/lib/types";

const SOURCE_LABEL: Record<string, string> = {
  local: "LOCAL",
  google: "GCAL",
  eventbrite: "EVENTBRITE",
  meetup: "MEETUP",
  launchfishers: "LAUNCH FISHERS",
  mutiny19: "MUTINY19",
  demo: "Not Real...Yet",
};

const SOURCE_COLOR: Record<string, string> = {
  local: "bg-teal-100 text-teal-700 border-teal-300",
  google: "bg-blue-100 text-blue-700 border-blue-300",
  eventbrite: "bg-orange-100 text-orange-700 border-orange-300",
  meetup: "bg-red-100 text-red-700 border-red-300",
  launchfishers: "bg-violet-100 text-violet-700 border-violet-300",
  mutiny19: "bg-amber-100 text-amber-700 border-amber-300",
  demo: "bg-slate-100 text-slate-500 border-slate-300 italic",
};

function formatDate(dateStr: string, timeStr?: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  if (!timeStr) return formatted;
  const t = new Date(`2000-01-01T${timeStr}`);
  const timeFormatted = t.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${formatted} \u2022 ${timeFormatted}`;
}

interface EventRowProps {
  event: Event;
  index: number;
}

function EventRow({ event, index }: EventRowProps) {
  const sourceColor = SOURCE_COLOR[event.source] ?? SOURCE_COLOR.local;
  const sourceLabel =
    SOURCE_LABEL[event.source] ?? event.source.toUpperCase();

  return (
    <div
      className={`flex items-start gap-6 px-6 py-5 rounded-2xl border-2 border-slate-200 shrink-0 ${
        index % 2 === 0 ? "bg-white" : "bg-transparent"
      }`}
    >
      {/* Index number */}
      <span
        className="text-teal-500 font-bold shrink-0 mt-1 tabular-nums"
        style={{ fontSize: "clamp(1.8rem, 2.5vw, 3rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-slate-800 font-semibold leading-tight"
            style={{ fontSize: "clamp(2rem, 2.8vw, 3.5rem)" }}
          >
            {event.title}
          </h3>
          <span
            className={`shrink-0 border-2 rounded-full px-3 py-1 font-bold tracking-wide whitespace-nowrap ${sourceColor}`}
            style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)" }}
          >
            {sourceLabel}
          </span>
        </div>
        <p
          className="text-teal-600 font-medium mt-1"
          style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}
        >
          {event.recurrence ?? formatDate(event.date, event.time)}
        </p>
        {event.location && (
          <p
            className="text-slate-400 mt-1 truncate"
            style={{ fontSize: "clamp(1.6rem, 1.9vw, 2.2rem)" }}
          >
            {event.location}
          </p>
        )}
      </div>
    </div>
  );
}

interface EventsSlideProps {
  events: Event[];
}

export default function EventsSlide({ events }: EventsSlideProps) {
  const upcoming = events.slice(0, 12);
  const listRef = useAutoScroll(upcoming.length, 36_000, 3);

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2
            className="text-teal-600 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(3rem, 4vw, 5rem)" }}
          >
            Upcoming Events
          </h2>
          <p className="text-slate-400 mt-1" style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}>
            Indiana IoT Lab &middot; Fishers, IN
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400" style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}>
            Next {upcoming.length} events
          </p>
          <p className="text-slate-300 mt-1" style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}>indianaiot.com</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-amber-300 shrink-0" />

      {/* Scrolling events list */}
      {upcoming.length > 0 ? (
        <div
          ref={listRef}
          className="flex flex-col gap-3 flex-1 overflow-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {upcoming.map((event, i) => (
            <EventRow key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p
            className="text-slate-400"
            style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}
          >
            No upcoming events
          </p>
          <p className="text-slate-300 text-center max-w-xl" style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}>
            Submit an event via GitHub pull request to appear here.
          </p>
        </div>
      )}
    </div>
  );
}
