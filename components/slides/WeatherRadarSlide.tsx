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
      <div className="shrink-0 flex items-center justify-between px-10 py-6 border-b-2 border-slate-200">
        <div className="flex items-center gap-4">
          <h2
            className="text-teal-600 font-black tracking-widest uppercase"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            Weather Radar
          </h2>
          <div className="flex items-center gap-2 bg-teal-50 border-2 border-teal-200 rounded-full px-3 py-1">
            <div className="w-3.5 h-3.5 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.4)]" />
            <span className="text-teal-600 font-medium" style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)" }}>NEXRAD</span>
          </div>
        </div>
        <span className="text-slate-300 tracking-wide" style={{ fontSize: "clamp(1.4rem, 1.8vw, 1.8rem)" }}>
          Fishers, IN &nbsp;·&nbsp; ~50 mi view
        </span>
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 overflow-hidden">
        <WeatherRadarMap />
      </div>
    </div>
  );
}
