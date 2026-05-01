"use client";

import dynamic from "next/dynamic";

const WeatherRadarMap = dynamic(() => import("./WeatherRadarMap"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-white/30 text-3xl">Initializing radar...</p>
    </div>
  ),
});

export default function WeatherRadarSlide() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-10 py-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h2
            className="text-cyan-400 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            Weather Radar
          </h2>
          <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-lg font-medium">LIVE</span>
          </div>
        </div>
        <span className="text-white/25 text-xl tracking-wide">
          Fishers, IN &nbsp;·&nbsp; 20 mi radius
        </span>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <WeatherRadarMap />
      </div>
    </div>
  );
}
