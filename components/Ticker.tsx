"use client";

import type { Event, Announcement } from "@/lib/types";

interface TickerProps {
  events: Event[];
  announcements: Announcement[];
}

function formatEventItem(e: Event): string {
  const dateParts = e.date.split("-");
  const d = new Date(
    Number(dateParts[0]),
    Number(dateParts[1]) - 1,
    Number(dateParts[2])
  );
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeStr = e.time
    ? " " +
      new Date(`2000-01-01T${e.time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
  return `${dateStr}${timeStr} — ${e.title}${e.location ? " @ " + e.location : ""}`;
}

export default function Ticker({ events, announcements }: TickerProps) {
  const items = [
    ...events.slice(0, 6).map(formatEventItem),
    ...announcements.map((a) => a.text),
  ];

  if (items.length === 0) return null;

  const text = items.join("   \u2022   ");

  return (
    <div className="shrink-0 bg-amber-500/10 border-t border-amber-500/30 overflow-hidden">
      <div
        className="ticker-track whitespace-nowrap text-amber-300 text-2xl py-3 px-0"
        aria-live="off"
      >
        <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  );
}
