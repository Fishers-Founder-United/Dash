"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
import CommunityStatsSlide from "./slides/CommunityStatsSlide";
import PhotoSlide from "./slides/PhotoSlide";
import FeaturedEventSlide from "./slides/FeaturedEventSlide";
import MeshSlide from "./slides/MeshSlide";
import type { DashboardData } from "@/lib/types";

// Right panel slides only (clock/weather lives permanently on the left)
const SLIDES = ["featured", "events", "news", "radar", "mesh", "spotlight", "stats", "photos", "funfact", "announcements"] as const;
type SlideId = (typeof SLIDES)[number];
const DURATIONS: Record<SlideId, number> = {
  featured: 20,
  events: 40,
  news: 40,
  radar: 25,
  mesh: 50,
  spotlight: 15,
  stats: 15,
  photos: 20,
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
  featuredIndex,
}: {
  slide: SlideId;
  data: DashboardData;
  spotlightIndex: number;
  featuredIndex: number;
}) {
  switch (slide) {
    case "featured":
      return data.featuredEvents.length > 0
        ? <FeaturedEventSlide event={data.featuredEvents[featuredIndex % data.featuredEvents.length]} />
        : null;
    case "events":
      return <EventsSlide events={data.events} />;
    case "radar":
      return <WeatherRadarSlide />;
    case "mesh":
      return <MeshSlide />;
    case "spotlight":
      return (
        <SpotlightSlide spotlights={data.spotlights} index={spotlightIndex} />
      );
    case "news":
      return <NewsSlide news={data.news} />;
    case "stats":
      return data.stats ? <CommunityStatsSlide stats={data.stats} /> : null;
    case "photos":
      return <PhotoSlide photos={data.photos} />;
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
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Anti-burn-in: apply a small random pixel shift once per minute instead of
  // a continuous CSS animation with will-change (which forces GPU compositing
  // of the entire page every frame).
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const OFFSETS = [
      [0, 0], [3, 2], [-2, 3], [-3, -2], [2, -1], [1, 3], [-1, -3],
    ];
    let i = 0;
    const shift = () => {
      if (!rootRef.current) return;
      const [x, y] = OFFSETS[i % OFFSETS.length];
      rootRef.current.style.transform = `translate(${x}px, ${y}px)`;
      i++;
    };
    shift();
    const id = setInterval(shift, 60_000); // once per minute
    return () => clearInterval(id);
  }, []);

  // Filter out slides that have no data to show
  const activeSlides = useMemo(() => {
    return SLIDES.filter((id) => {
      switch (id) {
        case "featured":
          return data.featuredEvents.length > 0;
        case "events":
          return data.events.length > 0;
        case "spotlight":
          return data.spotlights.length > 0;
        case "announcements":
          return data.announcements.length > 0;
        case "news":
          return data.news.length > 0;
        case "stats":
          return data.stats !== null;
        case "photos":
          return data.photos.length > 0;
        case "radar":
        case "mesh":
        case "funfact":
          return true; // always show
      }
    });
  }, [data.featuredEvents.length, data.events.length, data.spotlights.length, data.announcements.length, data.news.length, data.stats, data.photos.length]);

  const safeIdx = activeSlides.length > 0 ? slideIdx % activeSlides.length : 0;
  const currentSlide = activeSlides[safeIdx] ?? "radar";

  const advance = useCallback(() => {
    // Cycle to next featured event each time the featured slide rotates out
    if (currentSlide === "featured" && data.featuredEvents.length > 1) {
      setFeaturedIndex((i) => (i + 1) % data.featuredEvents.length);
    }
    setSlideIdx((i) => (activeSlides.length > 0 ? (i + 1) % activeSlides.length : 0));
  }, [activeSlides.length, currentSlide, data.featuredEvents.length]);

  // Reset index when active slides change
  useEffect(() => {
    setSlideIdx(0);
  }, [activeSlides.length]);

  useEffect(() => {
    const timer = setTimeout(advance, DURATIONS[currentSlide] * 1000);
    return () => clearTimeout(timer);
  }, [safeIdx, advance, currentSlide]);

  return (
    <div ref={rootRef} className="grid-field flex flex-col h-screen overflow-hidden select-none">
      {/* Station telemetry rail */}
      <div className="shrink-0 flex items-center justify-between px-14 py-5 border-b-2 border-[var(--line)] bg-white/85 backdrop-blur-sm">
        <div className="flex items-center gap-7 min-w-0">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/logos/indiana-iot-lab.png`}
            alt="Indiana IoT Lab — Fishers"
            className="h-20 shrink-0"
          />
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-baseline gap-3">
              <span className="dot shrink-0" />
              <span
                className="mono font-bold tracking-[0.22em] text-[var(--ink)]"
                style={{ fontSize: "clamp(1.5rem, 1.9vw, 2.6rem)" }}
              >
                STATION IIL&#8209;FISHERS
              </span>
            </div>
            <span
              className="eyebrow eyebrow-amber"
              style={{ fontSize: "clamp(1.1rem, 1.3vw, 1.7rem)" }}
            >
              A Catalyst For Innovation
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <span
            className="readout hidden xl:inline text-[var(--muted)]"
            style={{ fontSize: "clamp(1.3rem, 1.5vw, 2rem)" }}
          >
            39.96&deg;N&nbsp;&nbsp;086.01&deg;W
          </span>
          <div className="flex items-center gap-3">
            <span className="dot shrink-0" />
            <span
              className="readout text-[var(--accent)]"
              style={{ fontSize: "clamp(1.3rem, 1.5vw, 2rem)" }}
            >
              Sync&nbsp;Live
            </span>
          </div>
          <NavDots
            total={activeSlides.length}
            current={safeIdx}
            onSelect={setSlideIdx}
            hidden={isKiosk}
          />
          <span
            className="readout text-[var(--muted)]"
            style={{ fontSize: "clamp(1.3rem, 1.6vw, 2.2rem)" }}
          >
            Fishers&nbsp;&middot;&nbsp;IN
          </span>
        </div>
      </div>

      {/* Main content: left panel + right rotating panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: persistent clock + weather (38% width) */}
        <div className="w-[38%] shrink-0">
          <ClockWeatherPanel events={data.events} />
        </div>

        {/* Right: rotating content (62% width) */}
        <div className="flex-1 relative overflow-hidden">
          {/* Slide progress bar + mono channel counter */}
          <div className="absolute top-0 left-0 right-0 z-10 h-[10px] bg-[var(--line)]">
            <motion.div
              key={`progress-${safeIdx}`}
              className="h-full bg-[var(--accent)] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: DURATIONS[currentSlide],
                ease: "linear",
              }}
            />
          </div>
          <span
            className="mono absolute top-5 right-8 z-10 tracking-[0.15em] text-[var(--faint)] tabular-nums"
            style={{ fontSize: "clamp(1.3rem, 1.5vw, 1.9rem)" }}
          >
            {String(safeIdx + 1).padStart(2, "0")} / {String(activeSlides.length).padStart(2, "0")}
          </span>

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
                featuredIndex={featuredIndex}
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
