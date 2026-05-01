"use client";

import { useEffect, useRef, useState } from "react";
import type { WeatherData, ForecastDay } from "@/lib/types";
import { fetchWeather, wmoDescription, wmoIcon } from "@/lib/weather";

const LAT = 39.9556;
const LON = -86.0131;
const ZOOM = 6;

// Iowa Environmental Mesonet NEXRAD composite — free, no API key, reliable
// Tiles update automatically every ~5 min on IEM's servers
const IEM_RADAR_URL =
  "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png";

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
            <span className="text-white font-bold" style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}>
              {day.high}&deg;
            </span>
            <span className="text-white/35" style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}>
              {day.low}&deg;
            </span>
          </div>
          <span className="text-white/40 text-center leading-tight" style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}>
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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Init map once
  useEffect(() => {
    let mounted = true;
    import("leaflet").then((L) => {
      if (!mapDivRef.current || mapRef.current || !mounted) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });

      const map = L.map(mapDivRef.current, {
        center: [LAT, LON],
        zoom: ZOOM,
        minZoom: ZOOM,
        maxZoom: ZOOM,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });
      mapRef.current = map;

      // Dark base map
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png").addTo(map);

      // IEM NEXRAD radar overlay
      const radar = L.tileLayer(IEM_RADAR_URL, { opacity: 0.8, zIndex: 10 });
      radar.addTo(map);
      radarLayerRef.current = radar;

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

      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
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

  // Refresh radar tiles every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      radarLayerRef.current?.redraw();
      setLastUpdate(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather for forecast strip
  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(() => fetchWeather().then(setWeather), 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-hidden">
        <div ref={mapDivRef} className="h-full w-full" />

        {/* Updated timestamp */}
        {lastUpdate && (
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white font-mono text-2xl">{lastUpdate}</span>
            <span className="text-white/50 text-xl">RADAR</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-[1000] text-white/30 text-xl bg-black/50 rounded-lg px-3 py-1">
          ~400 mi view · NEXRAD
        </div>
      </div>

      {weather && <ForecastStrip forecast={weather.forecast} />}
    </div>
  );
}
