"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherData, ForecastDay } from "@/lib/types";
import { fetchWeather, wmoDescription } from "@/lib/weather";

const LAT = 39.9556;
const LON = -86.0131;
const ZOOM = 9; // ~40 mile radius view

interface RainViewerFrame {
  time: number;
  path: string;
  isNowcast?: boolean;
}

interface RadarState {
  host: string;
  frames: RainViewerFrame[];
}

async function fetchRainViewer(): Promise<RadarState | null> {
  try {
    const res = await fetch(
      "https://api.rainviewer.com/public/weather-maps.json",
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const frames: RainViewerFrame[] = [
      ...(data.radar?.past ?? []).map((f: { time: number; path: string }) => ({
        ...f,
        isNowcast: false,
      })),
      ...(data.radar?.nowcast ?? []).map(
        (f: { time: number; path: string }) => ({ ...f, isNowcast: true })
      ),
    ];
    return { host: data.host as string, frames };
  } catch {
    return null;
  }
}

function ForecastStrip({ forecast }: { forecast: ForecastDay[] }) {
  return (
    <div className="flex justify-around items-center px-6 py-4 bg-black/40 border-t border-white/5">
      {forecast.map((day, i) => (
        <div key={day.label} className="flex flex-col items-center gap-1">
          <span
            className={`font-semibold ${i === 0 ? "text-cyan-300" : "text-white/50"}`}
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.5rem)" }}
          >
            {day.label}
          </span>
          <div className="flex gap-2 items-baseline">
            <span
              className="text-white font-bold"
              style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              {day.high}&deg;
            </span>
            <span
              className="text-white/35"
              style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
            >
              {day.low}&deg;
            </span>
          </div>
          <span
            className="text-white/40 text-center leading-tight"
            style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}
          >
            {wmoDescription(day.weatherCode)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WeatherRadarMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const radarLayerRef = useRef<import("leaflet").TileLayer | null>(null);
  const [radar, setRadar] = useState<RadarState | null>(null);
  const [frameIdx, setFrameIdx] = useState(0);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentFrame, setCurrentFrame] = useState<RainViewerFrame | null>(
    null
  );

  // Init Leaflet map on mount
  useEffect(() => {
    let mounted = true;
    import("leaflet").then((L) => {
      if (!mapDivRef.current || mapRef.current || !mounted) return;

      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "",
        iconUrl: "",
        shadowUrl: "",
      });

      const map = L.map(mapDivRef.current, {
        center: [LAT, LON],
        zoom: ZOOM,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });
      mapRef.current = map;

      // Dark base tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { opacity: 0.9, maxZoom: 19 }
      ).addTo(map);

      // IoT Lab location marker
      L.circleMarker([LAT, LON], {
        radius: 10,
        fillColor: "#06b6d4",
        color: "#ffffff",
        weight: 2.5,
        fillOpacity: 1,
      })
        .bindTooltip("Indiana IoT Lab", {
          permanent: true,
          direction: "right",
          offset: [14, 0],
          className: "radar-label",
        })
        .addTo(map);

      // 20-mile radius circle
      L.circle([LAT, LON], {
        radius: 32186, // 20 miles in meters
        color: "#06b6d4",
        fillColor: "transparent",
        weight: 1,
        opacity: 0.25,
        dashArray: "6 4",
      }).addTo(map);
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch radar data
  useEffect(() => {
    const load = () =>
      fetchRainViewer().then((r) => {
        if (r) setRadar(r);
      });
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather for forecast strip
  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(
      () => fetchWeather().then(setWeather),
      30 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);

  // Animate radar frames
  useEffect(() => {
    if (!radar || radar.frames.length === 0) return;
    const timer = setInterval(() => {
      setFrameIdx((i) => (i + 1) % radar.frames.length);
    }, 600);
    return () => clearInterval(timer);
  }, [radar]);

  // Update radar tile layer when frame changes
  useEffect(() => {
    if (!radar || !mapRef.current) return;
    const frame = radar.frames[frameIdx];
    if (!frame) return;
    setCurrentFrame(frame);

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      if (radarLayerRef.current) {
        mapRef.current.removeLayer(radarLayerRef.current);
      }
      radarLayerRef.current = L.tileLayer(
        `${radar.host}${frame.path}/512/{z}/{x}/{y}/8/1_1.png`,
        { opacity: 0.75, maxZoom: 19, zIndex: 10 }
      );
      radarLayerRef.current.addTo(mapRef.current);
    });
  }, [frameIdx, radar]);

  const frameTime = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Map area */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapDivRef} className="h-full w-full" />

        {/* Frame timestamp overlay */}
        {frameTime && (
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                currentFrame?.isNowcast ? "bg-orange-400" : "bg-cyan-400"
              }`}
            />
            <span className="text-white font-mono text-2xl">{frameTime}</span>
            <span className="text-white/50 text-xl">
              {currentFrame?.isNowcast ? "FORECAST" : "RADAR"}
            </span>
          </div>
        )}

        {/* 20-mile label */}
        <div className="absolute bottom-4 left-4 z-[1000] text-white/30 text-xl bg-black/50 rounded-lg px-3 py-1">
          20 mi radius
        </div>

        {/* No radar fallback */}
        {!radar && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-[500]">
            <p className="text-white/40 text-3xl">Loading radar...</p>
          </div>
        )}
      </div>

      {/* 5-day forecast strip */}
      {weather && <ForecastStrip forecast={weather.forecast} />}
    </div>
  );
}
