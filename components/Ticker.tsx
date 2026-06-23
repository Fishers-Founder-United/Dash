"use client";

import { useMemo } from "react";
import { randomJokes } from "@/lib/iotJokes";
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
  return `${dateStr}${timeStr} \u2014 ${e.title}${e.location ? " @ " + e.location : ""}`;
}

export default function Ticker({ events, announcements }: TickerProps) {
  // Pick 2 random jokes on mount — stable for the component lifecycle
  const jokes = useMemo(() => randomJokes(2), []);

  const items = [
    ...events.slice(0, 6).map(formatEventItem),
    ...announcements.map((a) => a.text),
    ...jokes.map((j) => `\uD83E\uDD16 ${j}`), // 🤖 prefix
  ];

  if (items.length === 0) return null;

  const sep = " \u00A0\u00A0\u2022\u00A0\u00A0 "; // wider bullet separator
  const text = items.join(sep);

  return (
    <div className="shrink-0 bg-gradient-to-r from-teal-100 via-teal-50 to-teal-100 border-t-2 border-teal-200 overflow-hidden backdrop-blur-sm">
      <div
        className="ticker-track whitespace-nowrap text-teal-700 py-5 px-0"
        style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.8rem)" }}
        aria-live="off"
      >
        <span>{text}{sep}</span>
        <span>{text}{sep}</span>
      </div>
    </div>
  );
}
