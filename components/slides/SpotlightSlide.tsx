"use client";

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
          className="text-white/40 text-center"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
        >
          No spotlights yet
        </p>
        <p className="text-white/25 text-2xl text-center max-w-xl">
          Know a maker or startup worth featuring? Open a PR and add them to
          spotlights.json!
        </p>
      </div>
    );
  }

  const spotlight = spotlights[index % spotlights.length];

  return (
    <div className="flex flex-col h-full px-12 py-10">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-amber-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Community Spotlight
        </h2>
        {spotlights.length > 1 && (
          <p className="text-white/30 text-xl mt-1">
            {(index % spotlights.length) + 1} of {spotlights.length}
          </p>
        )}
      </div>

      <div className="h-px bg-amber-500/20 mb-10" />

      {/* Spotlight card */}
      <div className="flex flex-col flex-1 justify-center gap-8 max-w-5xl mx-auto w-full">
        {/* Tags */}
        {spotlight.tags && spotlight.tags.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {spotlight.tags.map((tag) => (
              <span
                key={tag}
                className="bg-amber-500/15 text-amber-400/80 border border-amber-500/20 rounded-full px-4 py-1 text-xl font-medium uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Name */}
        <div>
          <h3
            className="text-white font-black leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
          >
            {spotlight.name}
          </h3>
          <p
            className="text-amber-300 font-semibold mt-3"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            {spotlight.tagline}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-white/70 leading-relaxed"
          style={{ fontSize: "clamp(1.25rem, 2vw, 2rem)" }}
        >
          {spotlight.description}
        </p>

        {/* Website */}
        {spotlight.website && (
          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-px bg-amber-500/40" />
            <p
              className="text-amber-400/60 font-mono"
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.8rem)" }}
            >
              {spotlight.website.replace(/^https?:\/\//, "")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
