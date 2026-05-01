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
  local: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  google: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  eventbrite: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  meetup: "bg-red-500/20 text-red-300 border-red-500/30",
  launchfishers: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  mutiny19: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  demo: "bg-white/5 text-white/45 border-white/10 italic",
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
      className={`flex items-start gap-6 px-6 py-5 rounded-2xl border border-white/5 shrink-0 ${
        index % 2 === 0 ? "bg-white/[0.04]" : "bg-transparent"
      }`}
    >
      {/* Index number */}
      <span
        className="text-cyan-400/50 font-bold shrink-0 mt-1 tabular-nums"
        style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="text-white font-semibold leading-tight"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 2.2rem)" }}
          >
            {event.title}
          </h3>
          <span
            className={`shrink-0 border rounded-full px-3 py-1 text-base font-bold tracking-wide whitespace-nowrap ${sourceColor}`}
          >
            {sourceLabel}
          </span>
        </div>
        <p
          className="text-cyan-300/80 font-medium mt-1"
          style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.8rem)" }}
        >
          {event.recurrence ?? formatDate(event.date, event.time)}
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
  const upcoming = events.slice(0, 12);
  const listRef = useAutoScroll(upcoming.length, 36_000);

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2
            className="text-cyan-400 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
          >
            Upcoming Events
          </h2>
          <p className="text-white/50 text-2xl mt-1">
            Indiana IoT Lab &middot; Fishers, IN
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-2xl">
            Next {upcoming.length} events
          </p>
          <p className="text-white/35 text-xl mt-1">indianaiot.com</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-amber-500/20 shrink-0" />

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
            className="text-white/50"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            No upcoming events
          </p>
          <p className="text-white/35 text-2xl text-center max-w-xl">
            Submit an event via GitHub pull request to appear here.
          </p>
        </div>
      )}
    </div>
  );
}
