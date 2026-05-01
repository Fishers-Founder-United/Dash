"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavDots from "./NavDots";
import Ticker from "./Ticker";
import ClockWeatherSlide from "./slides/ClockWeatherSlide";
import EventsSlide from "./slides/EventsSlide";
import SpotlightSlide from "./slides/SpotlightSlide";
import AnnouncementsSlide from "./slides/AnnouncementsSlide";
import type { DashboardData } from "@/lib/types";

const SLIDE_DURATIONS = [15, 20, 15, 15]; // seconds per slide

const variants = {
  enter: { opacity: 0, scale: 0.98 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.01 },
};

interface SlideShowProps {
  data: DashboardData;
  isKiosk?: boolean;
  spotlightIndex: number;
}

function SlideContent({
  slideIndex,
  data,
  spotlightIndex,
}: {
  slideIndex: number;
  data: DashboardData;
  spotlightIndex: number;
}) {
  switch (slideIndex) {
    case 0:
      return <ClockWeatherSlide />;
    case 1:
      return <EventsSlide events={data.events} />;
    case 2:
      return (
        <SpotlightSlide
          spotlights={data.spotlights}
          index={spotlightIndex}
        />
      );
    case 3:
      return <AnnouncementsSlide announcements={data.announcements} />;
    default:
      return null;
  }
}

export default function SlideShow({
  data,
  isKiosk,
  spotlightIndex,
}: SlideShowProps) {
  const [current, setCurrent] = useState(0);
  const TOTAL = 4;

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % TOTAL);
  }, []);

  useEffect(() => {
    const duration = SLIDE_DURATIONS[current] * 1000;
    const timer = setTimeout(advance, duration);
    return () => clearTimeout(timer);
  }, [current, advance]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a1a] overflow-hidden select-none">
      {/* Branding bar */}
      <div className="shrink-0 flex items-center justify-between px-10 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span
            className="text-white font-bold tracking-widest uppercase"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.8rem)" }}
          >
            Fishers Founders United
          </span>
        </div>
        <span className="text-white/25 text-lg tracking-widest uppercase">
          Fishers, Indiana
        </span>
      </div>

      {/* Slide area */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SlideContent
              slideIndex={current}
              data={data}
              spotlightIndex={spotlightIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav dots */}
      <NavDots
        total={TOTAL}
        current={current}
        onSelect={setCurrent}
        hidden={isKiosk}
      />

      {/* Ticker */}
      <Ticker events={data.events} announcements={data.announcements} />
    </div>
  );
}
