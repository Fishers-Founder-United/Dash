"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavDots from "./NavDots";
import Ticker from "./Ticker";
import ClockWeatherPanel from "./ClockWeatherPanel";
import EventsSlide from "./slides/EventsSlide";
import SpotlightSlide from "./slides/SpotlightSlide";
import AnnouncementsSlide from "./slides/AnnouncementsSlide";
import WeatherRadarSlide from "./slides/WeatherRadarSlide";
import type { DashboardData } from "@/lib/types";

// Right panel slides only (clock/weather lives permanently on the left)
const SLIDES = ["events", "radar", "spotlight", "announcements"] as const;
type SlideId = (typeof SLIDES)[number];
const DURATIONS: Record<SlideId, number> = {
  events: 40,
  radar: 25,
  spotlight: 15,
  announcements: 15,
};

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

interface SlideShowProps {
  data: DashboardData;
  isKiosk?: boolean;
  spotlightIndex: number;
}

function RightPanel({
  slide,
  data,
  spotlightIndex,
}: {
  slide: SlideId;
  data: DashboardData;
  spotlightIndex: number;
}) {
  switch (slide) {
    case "events":
      return <EventsSlide events={data.events} />;
    case "radar":
      return <WeatherRadarSlide />;
    case "spotlight":
      return (
        <SpotlightSlide spotlights={data.spotlights} index={spotlightIndex} />
      );
    case "announcements":
      return <AnnouncementsSlide announcements={data.announcements} />;
  }
}

export default function SlideShow({
  data,
  isKiosk,
  spotlightIndex,
}: SlideShowProps) {
  const [slideIdx, setSlideIdx] = useState(0);
  const currentSlide = SLIDES[slideIdx];

  const advance = useCallback(() => {
    setSlideIdx((i) => (i + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(advance, DURATIONS[currentSlide] * 1000);
    return () => clearTimeout(timer);
  }, [slideIdx, advance, currentSlide]);

  return (
    <div className="flex flex-col h-screen bg-[#060d1a] overflow-hidden select-none">
      {/* Branding bar */}
      <div className="shrink-0 flex items-center justify-between px-10 py-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-5">
          <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
          <span
            className="text-white font-bold tracking-widest uppercase"
            style={{ fontSize: "clamp(1.1rem, 2vw, 2rem)" }}
          >
            Indiana IoT Lab
          </span>
          <span
            className="text-cyan-500/50 tracking-wider italic"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.5rem)" }}
          >
            A Catalyst For Innovation
          </span>
        </div>
        <div className="flex items-center gap-6">
          <NavDots
            total={SLIDES.length}
            current={slideIdx}
            onSelect={setSlideIdx}
            hidden={isKiosk}
          />
          <span className="text-white/20 tracking-widest uppercase text-lg">
            Fishers, IN
          </span>
        </div>
      </div>

      {/* Main content: left panel + right rotating panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: persistent clock + weather (38% width) */}
        <div className="w-[38%] shrink-0">
          <ClockWeatherPanel />
        </div>

        {/* Right: rotating content (62% width) */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <RightPanel
                slide={currentSlide}
                data={data}
                spotlightIndex={spotlightIndex}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom ticker */}
      <Ticker events={data.events} announcements={data.announcements} />
    </div>
  );
}
