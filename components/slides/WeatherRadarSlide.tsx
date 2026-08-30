"use client";

import dynamic from "next/dynamic";

const WeatherRadarMap = dynamic(() => import("./WeatherRadarMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-slate-300 text-3xl">Initializing radar...</p>
    </div>
  ),
});

export default function WeatherRadarSlide() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-10 py-6 border-b-2 border-[var(--line)]">
        <div className="flex items-center gap-5">
          <div>
            <p className="eyebrow flex items-center gap-3" style={{ fontSize: "clamp(1.3rem, 1.6vw, 2rem)" }}>
              <span className="text-[var(--faint)]">//</span> Radar · Live
            </p>
            <h2
              className="text-[var(--ink)] font-black tracking-tight mt-2"
              style={{ fontSize: "clamp(3rem, 4vw, 5rem)" }}
            >
              Weather Radar
            </h2>
          </div>
          <div className="tag flex items-center gap-2.5 bg-[var(--accent-tint)] border-[var(--line)] text-[var(--accent)] px-3 py-1.5 self-end mb-1">
            <span className="dot shrink-0" style={{ fontSize: "0.75rem" }} />
            <span style={{ fontSize: "clamp(1.6rem, 1.8vw, 1.9rem)" }}>NEXRAD</span>
          </div>
        </div>
        <span className="readout text-[var(--faint)]" style={{ fontSize: "clamp(1.6rem, 1.9vw, 2.3rem)" }}>
          39.96&deg;N 086.01&deg;W &nbsp;·&nbsp; ~50 MI
        </span>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <WeatherRadarMap />
      </div>
    </div>
  );
}
