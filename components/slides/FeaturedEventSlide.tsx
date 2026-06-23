"use client";

import { publicUrl } from "@/lib/basepath";
import type { FeaturedEvent } from "@/lib/types";

interface FeaturedEventSlideProps {
  event: FeaturedEvent;
}

function formatEventDate(date: string, time?: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dayStr = dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!time) return dayStr;
  const t = new Date(`2000-01-01T${time}`);
  const timeStr = t.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dayStr}  ·  ${timeStr}`;
}

export default function FeaturedEventSlide({ event }: FeaturedEventSlideProps) {
  const hasImage = !!event.image;

  // Poster mode: image already contains all event info — show full-bleed
  if (event.poster && hasImage) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={publicUrl(event.image!)}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  // Standard mode: image as background with text overlay
  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {hasImage && (
        <>
          <img
            src={publicUrl(event.image!)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/30" />
        </>
      )}

      <div className={`relative flex flex-col h-full ${hasImage ? "justify-end" : "justify-center"} px-14 pb-14 pt-10 gap-6`}>
        {/* Badge */}
        <div className={`shrink-0 ${hasImage ? "mt-auto" : ""}`}>
          <span className="inline-block bg-amber-400 text-slate-900 font-black text-lg tracking-widest uppercase px-5 py-2 rounded-full shadow-md">
            Featured Event
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-black leading-[1.05] tracking-tight ${hasImage ? "text-white" : "text-slate-800"}`}
          style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
        >
          {event.title}
        </h2>

        {/* Subtitle */}
        {event.subtitle && (
          <p
            className={`font-semibold tracking-wide ${hasImage ? "text-teal-300" : "text-teal-600"}`}
            style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}
          >
            {event.subtitle}
          </p>
        )}

        {/* Date / Time / Location */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <p
            className={`font-medium tracking-wide ${hasImage ? "text-white/90" : "text-slate-600"}`}
            style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)" }}
          >
            {formatEventDate(event.date, event.time)}
          </p>
          {event.location && (
            <p
              className={`font-medium ${hasImage ? "text-white/60" : "text-slate-400"}`}
              style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              {event.location}
            </p>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p
            className={`max-w-4xl leading-relaxed ${hasImage ? "text-white/70" : "text-slate-500"}`}
            style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
          >
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
