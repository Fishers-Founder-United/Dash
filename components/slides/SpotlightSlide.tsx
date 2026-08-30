"use client";

import { QRCodeSVG } from "qrcode.react";
import SlideHeader from "./SlideHeader";
import type { Spotlight } from "@/lib/types";

interface SpotlightSlideProps {
  spotlights: Spotlight[];
  index: number; // which spotlight to show (cycles with slide rotation)
}

export default function SpotlightSlide({
  spotlights,
  index,
}: SpotlightSlideProps) {
  if (spotlights.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-6 px-16">
        <p
          className="text-slate-400 text-center"
          style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}
        >
          No spotlights yet
        </p>
        <p className="text-slate-300 text-center max-w-xl" style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}>
          Know a maker or startup worth featuring? Open a PR and add them to
          spotlights.json!
        </p>
      </div>
    );
  }

  const spotlight = spotlights[index % spotlights.length];

  return (
    <div className="flex flex-col h-full px-12 py-10">
      <SlideHeader
        channel="Member · Spotlight"
        title="Community Spotlight"
        meta={
          spotlights.length > 1
            ? `${String((index % spotlights.length) + 1).padStart(2, "0")} / ${String(spotlights.length).padStart(2, "0")}`
            : undefined
        }
      />

      {/* Main content: info left, QR right */}
      <div className="flex flex-1 gap-10 min-h-0 mt-8">
        {/* Left: spotlight info */}
        <div className="flex flex-col flex-1 justify-center gap-6 min-h-0">
          {/* Logo + Category + Name row */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            {spotlight.logo && (
              <div className="shrink-0 w-40 h-40 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center">
                <img
                  src={spotlight.logo}
                  alt={`${spotlight.name} logo`}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Category */}
              {spotlight.category && (
                <p
                  className="eyebrow mb-2.5"
                  style={{ fontSize: "clamp(1.6rem, 1.9vw, 2.4rem)" }}
                >
                  {spotlight.category}
                </p>
              )}

              {/* Name + NEW badge */}
              <div className="flex items-center gap-5">
                <h3
                  className="text-[var(--ink)] font-black leading-tight"
                  style={{ fontSize: "clamp(3rem, 5vw, 6rem)" }}
                >
                  {spotlight.name}
                </h3>
                {spotlight.newMember && (
                  <span className="tag shrink-0 bg-[var(--amber)] text-white border-[var(--amber)] px-4 py-1.5 text-lg">
                    NEW
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-teal-600 font-semibold"
            style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}
          >
            {spotlight.tagline}
          </p>

          {/* Tags */}
          {spotlight.tags && spotlight.tags.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {spotlight.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag bg-[var(--accent-tint)] text-[var(--accent)] border-[var(--line)] px-4 py-1"
                  style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p
            className="text-[var(--muted)] leading-relaxed"
            style={{ fontSize: "clamp(1.8rem, 2.2vw, 2.5rem)" }}
          >
            {spotlight.description}
          </p>

          {/* Website */}
          {spotlight.website && (
            <div className="flex items-center gap-4 mt-1">
              <span className="mono text-[var(--faint)]" style={{ fontSize: "clamp(1.8rem, 2vw, 2.5rem)" }}>&gt;</span>
              <p
                className="mono text-[var(--accent)] tracking-[0.04em]"
                style={{ fontSize: "clamp(1.8rem, 2vw, 2.5rem)" }}
              >
                {spotlight.website.replace(/^https?:\/\//, "")}
              </p>
            </div>
          )}
        </div>

        {/* Right: QR code panel */}
        {spotlight.website && (
          <div className="hud shrink-0 flex flex-col items-center justify-center gap-5 w-96 bg-[var(--accent-tint)] border-2 border-[var(--line)] rounded-[10px] p-8">
            <div className="p-3 bg-white rounded-[8px]">
              <QRCodeSVG
                value={spotlight.website}
                size={280}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>
            <p
              className="mono uppercase tracking-[0.12em] text-[var(--accent)] font-bold text-center"
              style={{ fontSize: "clamp(1.6rem, 1.9vw, 2.3rem)" }}
            >
              Scan · Visit {spotlight.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
