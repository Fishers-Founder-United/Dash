"use client";

import { useEffect, useState, useRef } from "react";
import { fetchDashboardData } from "@/lib/events";
import SlideShow from "./SlideShow";
import type { DashboardData } from "@/lib/types";

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

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

  // Load dashboard data
  useEffect(() => {
    const load = () => fetchDashboardData().then(setData);
    load();
    const interval = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(interval);
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
