"use client";

import { QRCodeSVG } from "qrcode.react";
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
      <div className="mb-6 shrink-0">
        <h2
          className="text-cyan-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          Community Spotlight
        </h2>
        {spotlights.length > 1 && (
          <p className="text-white/45 text-2xl mt-1">
            {(index % spotlights.length) + 1} of {spotlights.length}
          </p>
        )}
      </div>

      <div className="h-px bg-cyan-500/20 mb-8 shrink-0" />

      {/* Main content: info left, QR right */}
      <div className="flex flex-1 gap-10 min-h-0">
        {/* Left: spotlight info */}
        <div className="flex flex-col flex-1 justify-center gap-6 min-h-0">
          {/* Logo + Category + Name row */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            {spotlight.logo && (
              <div className="shrink-0 w-28 h-28 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
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
                  className="text-cyan-400/60 font-semibold tracking-widest uppercase mb-2"
                  style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.4rem)" }}
                >
                  {spotlight.category}
                </p>
              )}

              {/* Name + NEW badge */}
              <div className="flex items-center gap-5">
                <h3
                  className="text-white font-black leading-tight"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}
                >
                  {spotlight.name}
                </h3>
                {spotlight.newMember && (
                  <span className="shrink-0 bg-cyan-500 text-white font-black text-lg tracking-widest uppercase px-4 py-1.5 rounded-full animate-pulse">
                    NEW
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p
            className="text-cyan-300 font-semibold"
            style={{ fontSize: "clamp(1.3rem, 2.2vw, 2.2rem)" }}
          >
            {spotlight.tagline}
          </p>

          {/* Tags */}
          {spotlight.tags && spotlight.tags.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {spotlight.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-cyan-500/15 text-cyan-400/80 border border-cyan-500/20 rounded-full px-4 py-1 text-lg font-medium uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p
            className="text-white/70 leading-relaxed"
            style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.8rem)" }}
          >
            {spotlight.description}
          </p>

          {/* Website */}
          {spotlight.website && (
            <div className="flex items-center gap-4 mt-1">
              <div className="w-12 h-px bg-cyan-500/40" />
              <p
                className="text-cyan-400/60 font-mono"
                style={{ fontSize: "clamp(1rem, 1.6vw, 1.6rem)" }}
              >
                {spotlight.website.replace(/^https?:\/\//, "")}
              </p>
            </div>
          )}
        </div>

        {/* Right: QR code panel */}
        {spotlight.website && (
          <div className="shrink-0 flex flex-col items-center justify-center gap-5 w-72 bg-cyan-500/8 border border-cyan-500/20 rounded-2xl p-8">
            <div className="p-3 bg-white rounded-2xl">
              <QRCodeSVG
                value={spotlight.website}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
            </div>
            <p
              className="text-cyan-400 font-bold text-center"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.4rem)" }}
            >
              Visit {spotlight.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
