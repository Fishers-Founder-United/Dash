"use client";

import { useEffect, useRef } from "react";
import type { Event } from "@/lib/types";

const SOURCE_LABEL: Record<string, string> = {
  local: "LOCAL",
  google: "GCAL",
  eventbrite: "EVENTBRITE",
  meetup: "MEETUP",
  demo: "Not Real...Yet",
};

const SOURCE_COLOR: Record<string, string> = {
  local: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  google: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  eventbrite: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  demo: "bg-white/5 text-white/35 border-white/10 italic",
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
  const sourceColor = SOURCE_COLOR[event.source] ?? SOURCE_COLOR.local;
  const sourceLabel =
    SOURCE_LABEL[event.source] ?? event.source.toUpperCase();

  return (
    <div
      className={`flex items-start gap-6 p-6 rounded-2xl border border-white/5 shrink-0 ${
        index % 2 === 0 ? "bg-white/5" : "bg-transparent"
      }`}
    >
      {/* Index number */}
      <span
        className="text-cyan-400/60 font-bold shrink-0 mt-1"
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

// Scroll duration in ms — matches the slide display time so it finishes just before advancing
const SCROLL_DURATION = 36000;

export default function EventsSlide({ events }: EventsSlideProps) {
  const upcoming = events.slice(0, 12);
  const listRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el || upcoming.length <= 4) return;

    // Reset to top each time the slide mounts
    el.scrollTop = 0;

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    let start: number | null = null;

    function step(ts: number) {
      if (!el) return;
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      // ease-in-out cubic so it starts and ends gently
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.scrollTop = eased * maxScroll;
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    }

    // Small delay so the slide-in animation settles first
    const delay = setTimeout(() => {
      animRef.current = requestAnimationFrame(step);
    }, 800);

    return () => {
      clearTimeout(delay);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [upcoming.length]);

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
          <p className="text-white/40 text-xl mt-1">
            Indiana IoT Lab · Fishers, IN
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xl">
            Next {upcoming.length} events
          </p>
          <p className="text-white/20 text-lg mt-1">indianaiot.com</p>
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
            className="text-white/40"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
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
