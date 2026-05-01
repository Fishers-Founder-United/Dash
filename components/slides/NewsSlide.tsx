"use client";

import { useEffect, useRef } from "react";
import type { NewsItem } from "@/lib/types";

const SOURCE_COLOR: Record<string, string> = {
  insideindiana: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  ibj: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

function formatAge(publishedAt?: string): string {
  if (!publishedAt) return "";
  const diff = Date.now() - new Date(publishedAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface NewsRowProps {
  item: NewsItem;
  index: number;
}

function NewsRow({ item, index }: NewsRowProps) {
  const color = SOURCE_COLOR[item.source] ?? SOURCE_COLOR.insideindiana;
  const age = formatAge(item.publishedAt);

  return (
    <div
      className={`flex items-start gap-6 p-5 rounded-2xl border border-white/5 shrink-0 ${
        index % 2 === 0 ? "bg-white/5" : "bg-transparent"
      }`}
    >
      {/* Index */}
      <span
        className="text-cyan-400/40 font-bold shrink-0 mt-1 tabular-nums"
        style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p
            className="text-white font-semibold leading-snug"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 2.2rem)" }}
          >
            {item.title}
          </p>
          <span
            className={`shrink-0 border rounded-full px-3 py-1 text-sm font-bold tracking-wider ${color}`}
          >
            {item.sourceLabel}
          </span>
        </div>
        {item.description && (
          <p
            className="text-white/45 mt-1 line-clamp-2 leading-snug"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
          >
            {item.description}
          </p>
        )}
        {age && (
          <p className="text-white/25 text-xl mt-1">{age}</p>
        )}
      </div>
    </div>
  );
}

interface NewsSlideProps {
  news: NewsItem[];
}

const SCROLL_DURATION = 36000;

export default function NewsSlide({ news }: NewsSlideProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el || news.length <= 4) return;

    el.scrollTop = 0;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    let start: number | null = null;

    function step(ts: number) {
      if (!el) return;
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.scrollTop = eased * maxScroll;
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    }

    const delay = setTimeout(() => {
      animRef.current = requestAnimationFrame(step);
    }, 800);

    return () => {
      clearTimeout(delay);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [news.length]);

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2
            className="text-cyan-400 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
          >
            Indiana Business News
          </h2>
          <p className="text-white/40 text-xl mt-1">
            Inside Indiana Business · updated hourly
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/25 text-xl">{news.length} stories</p>
        </div>
      </div>

      <div className="h-px bg-emerald-500/20 shrink-0" />

      {news.length > 0 ? (
        <div
          ref={listRef}
          className="flex flex-col gap-3 flex-1 overflow-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {news.map((item, i) => (
            <NewsRow key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <p className="text-white/30" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}>
            Loading news...
          </p>
        </div>
      )}
    </div>
  );
}
