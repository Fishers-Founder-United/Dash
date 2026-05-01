"use client";

import { useEffect, useState, useRef } from "react";
import { fetchDashboardData } from "@/lib/events";
import SlideShow from "./SlideShow";
import type { DashboardData } from "@/lib/types";

const DATA_REFRESH_INTERVAL = 10 * 60 * 1000;  // refetch JSON every 10 min
const PAGE_RELOAD_INTERVAL  = 60 * 60 * 1000;  // hard reload every hour (picks up new deploys)

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    events: [],
    spotlights: [],
    announcements: [],
    news: [],
  });
  const [isKiosk, setIsKiosk] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightRotation = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect kiosk mode from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsKiosk(params.get("kiosk") === "true");
  }, []);

  // Refetch JSON data every 10 minutes
  useEffect(() => {
    const load = () => fetchDashboardData().then(setData);
    load();
    const interval = setInterval(load, DATA_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Hard-reload the page every hour so new deployments are picked up automatically
  useEffect(() => {
    const reload = setTimeout(() => window.location.reload(), PAGE_RELOAD_INTERVAL);
    return () => clearTimeout(reload);
  }, []);

  // Rotate spotlight index whenever spotlights data loads
  useEffect(() => {
    if (spotlightRotation.current) clearInterval(spotlightRotation.current);
    if (data.spotlights.length > 1) {
      spotlightRotation.current = setInterval(() => {
        setSpotlightIndex((i) => (i + 1) % data.spotlights.length);
      }, 60 * 1000); // rotate spotlight every minute
    }
    return () => {
      if (spotlightRotation.current) clearInterval(spotlightRotation.current);
    };
  }, [data.spotlights.length]);

  return (
    <SlideShow data={data} isKiosk={isKiosk} spotlightIndex={spotlightIndex} />
  );
}
