"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NavDots from "./NavDots";
import Ticker from "./Ticker";
import ClockWeatherPanel from "./ClockWeatherPanel";
import EventsSlide from "./slides/EventsSlide";
import SpotlightSlide from "./slides/SpotlightSlide";
import AnnouncementsSlide from "./slides/AnnouncementsSlide";
import WeatherRadarSlide from "./slides/WeatherRadarSlide";
import NewsSlide from "./slides/NewsSlide";
import FunFactSlide from "./slides/FunFactSlide";
import type { DashboardData } from "@/lib/types";

// Right panel slides only (clock/weather lives permanently on the left)
const SLIDES = ["events", "news", "radar", "spotlight", "funfact", "announcements"] as const;
type SlideId = (typeof SLIDES)[number];
const DURATIONS: Record<SlideId, number> = {
  events: 40,
  news: 40,
  radar: 25,
  spotlight: 15,
  funfact: 12,
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
    case "news":
      return <NewsSlide news={data.news} />;
    case "announcements":
      return <AnnouncementsSlide announcements={data.announcements} />;
    case "funfact":
      return <FunFactSlide />;
  }
}

export default function SlideShow({
  data,
  isKiosk,
  spotlightIndex,
}: SlideShowProps) {
  const [slideIdx, setSlideIdx] = useState(0);

  // Filter out slides that have no data to show
  const activeSlides = useMemo(() => {
    return SLIDES.filter((id) => {
      switch (id) {
        case "events":
          return data.events.length > 0;
        case "spotlight":
          return data.spotlights.length > 0;
        case "announcements":
          return data.announcements.length > 0;
        case "news":
          return data.news.length > 0;
        case "radar":
        case "funfact":
          return true; // always show
      }
    });
  }, [data.events.length, data.spotlights.length, data.announcements.length, data.news.length]);

  const safeIdx = activeSlides.length > 0 ? slideIdx % activeSlides.length : 0;
  const currentSlide = activeSlides[safeIdx] ?? "radar";

  const advance = useCallback(() => {
    setSlideIdx((i) => (activeSlides.length > 0 ? (i + 1) % activeSlides.length : 0));
  }, [activeSlides.length]);

  // Reset index when active slides change
  useEffect(() => {
    setSlideIdx(0);
  }, [activeSlides.length]);

  useEffect(() => {
    const timer = setTimeout(advance, DURATIONS[currentSlide] * 1000);
    return () => clearTimeout(timer);
  }, [safeIdx, advance, currentSlide]);

  return (
    <div className="flex flex-col h-screen bg-[#060d1a] overflow-hidden select-none burn-in-guard">
      {/* Branding bar */}
      <div className="shrink-0 flex items-center justify-between px-14 py-6 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-6">
          <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.6)] animate-pulse" />
          <span
            className="text-white font-bold tracking-widest uppercase"
            style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.4rem)" }}
          >
            Indiana IoT Lab
          </span>
          <span
            className="text-cyan-400/40 tracking-wider italic"
            style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.8rem)" }}
          >
            A Catalyst For Innovation
          </span>
        </div>
        <div className="flex items-center gap-6">
          <NavDots
            total={activeSlides.length}
            current={safeIdx}
            onSelect={setSlideIdx}
            hidden={isKiosk}
          />
          <span
            className="text-white/40 tracking-widest uppercase"
            style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.6rem)" }}
          >
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
          {/* Slide progress bar */}
          <div className="absolute top-0 left-0 right-0 z-10 h-[4px] bg-white/5">
            <motion.div
              key={`progress-${safeIdx}`}
              className="h-full bg-cyan-400/60"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: DURATIONS[currentSlide],
                ease: "linear",
              }}
            />
          </div>

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
