"use client";

import type { Event } from "@/lib/types";

const SOURCE_LABEL: Record<string, string> = {
  local: "LOCAL",
  google: "GCAL",
  eventbrite: "EVENTBRITE",
  meetup: "MEETUP",
};

const SOURCE_COLOR: Record<string, string> = {
  local: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  google: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  eventbrite: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  meetup: "bg-red-500/20 text-red-300 border-red-500/30",
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
  const sourceColor =
    SOURCE_COLOR[event.source] ?? SOURCE_COLOR.local;
  const sourceLabel = SOURCE_LABEL[event.source] ?? event.source.toUpperCase();

  return (
    <div
      className={`flex items-start gap-6 p-6 rounded-2xl border border-white/5 ${
        index % 2 === 0 ? "bg-white/5" : "bg-transparent"
      }`}
    >
      {/* Index number */}
      <span
        className="text-amber-400/60 font-bold shrink-0 mt-1"
        style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-white font-semibold leading-tight"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            {event.title}
          </h3>
          <span
            className={`shrink-0 border rounded-full px-3 py-1 text-sm font-bold tracking-wider ${sourceColor}`}
          >
            {sourceLabel}
          </span>
        </div>
        <p
          className="text-amber-300/80 font-medium mt-1"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.8rem)" }}
        >
          {formatDate(event.date, event.time)}
        </p>
        {event.location && (
          <p
            className="text-white/50 mt-1 truncate"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
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
  const upcoming = events.slice(0, 5);

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-amber-400 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
          >
            Upcoming Events
          </h2>
          <p className="text-white/40 text-xl mt-1">Fishers, IN Community Calendar</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xl">
            {upcoming.length} of {events.length} events
          </p>
          <p className="text-white/20 text-lg mt-1">
            github.com/Fishers-Founder-United/Dash
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-amber-500/20" />

      {/* Events list */}
      {upcoming.length > 0 ? (
        <div className="flex flex-col gap-3 flex-1">
          {upcoming.map((event, i) => (
            <EventRow key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-white/40"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}>
            No upcoming events
          </p>
          <p className="text-white/25 text-2xl text-center max-w-xl">
            Submit an event via GitHub pull request to appear here.
          </p>
        </div>
      )}
    </div>
  );
}
