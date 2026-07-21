"use client";

import { useEffect, useMemo, useRef } from "react";
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
  return `${dateStr}${timeStr} — ${e.title}${e.location ? " @ " + e.location : ""}`;
}

// Seconds for one full copy of the ticker text to scroll past — matches the
// original 90s CSS pacing (slow enough to avoid motion blur on a large TV).
const SCROLL_SECONDS = 90;

export default function Ticker({ events, announcements }: TickerProps) {
  // Pick 2 random jokes on mount — stable for the component lifecycle
  const jokes = useMemo(() => randomJokes(2), []);

  const items = [
    ...events.slice(0, 6).map(formatEventItem),
    ...announcements.map((a) => a.text),
    ...jokes.map((j) => `🤖 ${j}`), // 🤖 prefix
  ];

  const sep = "   •   "; // wider bullet separator
  const text = items.join(sep);

  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(false);

  // Drive the scroll with requestAnimationFrame instead of a CSS animation.
  // On a 24/7 TV kiosk, GPU-composited infinite CSS animations frequently
  // stall (and never resume) after the display sleeps/wakes; a rAF loop
  // resumes cleanly on the next visible frame and cannot get stuck.
  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    if (!track || !copy || !text) return;

    let raf = 0;
    let last: number | null = null;
    let offset = 0;

    const step = (ts: number) => {
      if (last === null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;

      if (!pausedRef.current) {
        const copyWidth = copy.offsetWidth || 1;
        const speed = copyWidth / SCROLL_SECONDS; // px per second
        offset += speed * dt;
        if (offset >= copyWidth) offset -= copyWidth; // seamless wrap
        track.style.transform = `translateX(${-offset}px)`;
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    // After the display sleeps/wakes rAF pauses while hidden; drop the stale
    // timestamp so the first frame back doesn't jump, then let the loop resume.
    const onVisibility = () => {
      last = null;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text]);

  if (items.length === 0) return null;

  return (
    <div
      className="shrink-0 bg-gradient-to-r from-teal-100 via-teal-50 to-teal-100 border-t-2 border-teal-200 overflow-hidden backdrop-blur-sm"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="inline-block whitespace-nowrap text-teal-700 py-6 px-0"
        style={{ fontSize: "clamp(1.6rem, 2.8vw, 3.5rem)", willChange: "transform" }}
        aria-live="off"
      >
        <span ref={copyRef}>{text}{sep}</span>
        <span>{text}{sep}</span>
      </div>
    </div>
  );
}
