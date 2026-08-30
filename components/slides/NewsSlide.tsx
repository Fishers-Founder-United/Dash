"use client";

import { useAutoScroll } from "@/lib/useAutoScroll";
import SlideHeader from "./SlideHeader";
import type { NewsItem } from "@/lib/types";

const SOURCE_COLOR: Record<string, string> = {
  insideindiana: "bg-emerald-100 text-emerald-700 border-emerald-300",
  ibj: "bg-blue-100 text-blue-700 border-blue-300",
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
      className={`flex items-start gap-6 p-6 rounded-[10px] border-2 border-l-[6px] border-[var(--line)] border-l-[var(--accent)] shrink-0 ${
        index % 2 === 0 ? "bg-white" : "bg-white/45"
      }`}
    >
      {/* Index */}
      <span
        className="mono text-[var(--accent)] font-bold shrink-0 mt-1 tabular-nums"
        style={{ fontSize: "clamp(1.8rem, 2.5vw, 3rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p
            className="text-[var(--ink)] font-semibold leading-snug"
            style={{ fontSize: "clamp(2rem, 2.8vw, 3rem)" }}
          >
            {item.title}
          </p>
          <span
            className={`tag shrink-0 px-3 py-1 whitespace-nowrap ${color}`}
            style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)" }}
          >
            {item.sourceLabel}
          </span>
        </div>
        {item.description && (
          <p
            className="text-[var(--muted)] mt-1.5 line-clamp-2 leading-snug"
            style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)" }}
          >
            {item.description}
          </p>
        )}
        {age && (
          <p className="mono text-[var(--faint)] tracking-[0.06em] mt-1.5" style={{ fontSize: "clamp(1.6rem, 1.8vw, 2rem)" }}>{age}</p>
        )}
      </div>
    </div>
  );
}

interface NewsSlideProps {
  news: NewsItem[];
}

export default function NewsSlide({ news }: NewsSlideProps) {
  const listRef = useAutoScroll(news.length, 36_000, 3);

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      <SlideHeader
        channel="Feed · Inside Indiana Business"
        title="Indiana Business News"
        meta={`${String(news.length).padStart(2, "0")} STORIES · HOURLY`}
      />

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
          <p className="text-slate-400" style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}>
            Loading news...
          </p>
        </div>
      )}
    </div>
  );
}
