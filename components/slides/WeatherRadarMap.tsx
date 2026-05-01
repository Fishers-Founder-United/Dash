"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherData, ForecastDay } from "@/lib/types";
import { fetchWeather, wmoDescription, wmoIcon } from "@/lib/weather";

const LAT = 39.9556;
const LON = -86.0131;
const ZOOM = 6; // broader view — comfortably within RainViewer's supported range

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

function radarTileUrl(host: string, path: string): string {
  // color 6 = Rainbow — well-supported across all RainViewer versions
  // 256px tiles, smooth=1, snow=1
  return `${host}${path}/256/{z}/{x}/{y}/6/1_1.png`;
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
          <span style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }} role="img">
            {wmoIcon(day.weatherCode)}
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
  const [currentFrame, setCurrentFrame] = useState<RainViewerFrame | null>(null);

  // Init Leaflet map once on mount
  useEffect(() => {
    let mounted = true;
    import("leaflet").then((L) => {
      if (!mapDivRef.current || mapRef.current || !mounted) return;

      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });

      const map = L.map(mapDivRef.current, {
        center: [LAT, LON],
        zoom: ZOOM,
        minZoom: ZOOM,
        maxZoom: ZOOM, // lock zoom so the map never requests out-of-range tiles
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
        { maxZoom: 19 }
      ).addTo(map);

      // IoT Lab marker
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

      // 20-mile radius ring
      L.circle([LAT, LON], {
        radius: 32186,
        color: "#06b6d4",
        fillColor: "transparent",
        weight: 1,
        opacity: 0.3,
        dashArray: "6 4",
      }).addTo(map);
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        radarLayerRef.current = null;
      }
    };
  }, []);

  // Fetch radar frames, refresh every 5 minutes
  useEffect(() => {
    const load = () => fetchRainViewer().then((r) => { if (r) setRadar(r); });
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather for forecast strip
  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(() => fetchWeather().then(setWeather), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Advance frame index every 700ms
  useEffect(() => {
    if (!radar || radar.frames.length === 0) return;
    const timer = setInterval(() => {
      setFrameIdx((i) => (i + 1) % radar.frames.length);
    }, 700);
    return () => clearInterval(timer);
  }, [radar]);

  // Update radar layer URL in-place via setUrl() — no add/remove, no flash
  useEffect(() => {
    if (!radar || !mapRef.current) return;
    const frame = radar.frames[frameIdx];
    if (!frame) return;
    setCurrentFrame(frame);

    const url = radarTileUrl(radar.host, frame.path);

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      if (radarLayerRef.current) {
        // Update URL in-place — tiles swap as they load, no layer removal
        radarLayerRef.current.setUrl(url);
      } else {
        // First frame: create the layer
        radarLayerRef.current = L.tileLayer(url, {
          opacity: 0.75,
          maxZoom: 19,
          zIndex: 10,
        });
        radarLayerRef.current.addTo(mapRef.current);
      }
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
      {/* Map */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapDivRef} className="h-full w-full" />

        {/* Frame timestamp */}
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

        {/* Radius label */}
        <div className="absolute bottom-4 left-4 z-[1000] text-white/30 text-xl bg-black/50 rounded-lg px-3 py-1">
          ~200 mi view
        </div>

        {/* Loading state */}
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
