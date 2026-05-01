"use client";

import { useEffect, useState } from "react";
import { fetchWeather, wmoCategory, wmoIcon } from "@/lib/weather";
import type { WeatherData } from "@/lib/types";

const WEATHER_BG: Record<string, string> = {
  clear: "from-cyan-950/80 via-sky-950/60 to-slate-950",
  cloudy: "from-slate-800/80 via-slate-900/60 to-slate-950",
  fog: "from-slate-700/80 via-slate-800/60 to-slate-950",
  rain: "from-blue-950/80 via-blue-900/60 to-slate-950",
  snow: "from-sky-900/80 via-sky-950/60 to-slate-950",
  storm: "from-purple-950/80 via-slate-900/60 to-slate-950",
};

const WEATHER_COLOR: Record<string, string> = {
  clear: "text-cyan-300",
  cloudy: "text-slate-300",
  fog: "text-slate-400",
  rain: "text-blue-300",
  snow: "text-sky-200",
  storm: "text-purple-300",
};

function ForecastDay({
  label, high, low, weatherCode, active,
}: {
  label: string; high: number; low: number; weatherCode: number; active?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all ${active ? "bg-white/10 ring-1 ring-white/20" : ""}`}>
      <span
        className="text-white/60 font-medium"
        style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}
      >
        {label}
      </span>
      <span style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.2rem)" }} role="img">
        {wmoIcon(weatherCode)}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-white/50 font-medium" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)" }}>H</span>
        <span className="text-white font-bold" style={{ fontSize: "clamp(1.2rem, 1.8vw, 2rem)" }}>{high}&deg;</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-white/40 font-medium" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.2rem)" }}>L</span>
        <span className="text-white/50" style={{ fontSize: "clamp(1rem, 1.5vw, 1.6rem)" }}>{low}&deg;</span>
      </div>
    </div>
  );
}

export default function ClockWeatherPanel() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const load = () =>
      fetchWeather().then((w) => {
        if (w) {
          setWeather(w);
          setWeatherError(false);
        } else {
          setWeatherError(true);
        }
      });
    load();
    const refresh = setInterval(load, 60 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  const category = weather ? wmoCategory(weather.weatherCode) : "clear";
  const bg = WEATHER_BG[category] ?? WEATHER_BG.clear;
  const labelColor = WEATHER_COLOR[category] ?? "text-cyan-300";

  const hours = time.getHours();
  const mins = String(time.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  const utcH = String(time.getUTCHours()).padStart(2, "0");
  const utcM = String(time.getUTCMinutes()).padStart(2, "0");

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const yearStr = time.getFullYear();

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b ${bg} transition-all duration-3000 border-r border-white/5 overflow-hidden`}
    >
      {/* Clock + UTC — flex section that can shrink */}
      <div className="flex flex-col items-center justify-center flex-[3] min-h-0 px-8 gap-2">
        <div className="flex flex-col items-center">
          {/* Local time */}
          <div className="flex items-start leading-none">
            <span
              className="text-white font-black tabular-nums"
              style={{ fontSize: "clamp(5rem, 9vw, 9rem)" }}
            >
              {h12}:{mins}
            </span>
            <span
              className="text-white/50 font-light ml-3 mt-3"
              style={{ fontSize: "clamp(1.8rem, 2.5vw, 3rem)" }}
            >
              {ampm}
            </span>
          </div>

          {/* UTC time */}
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-cyan-400/50 font-mono tracking-wider"
              style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              UTC {utcH}:{utcM}
            </span>
          </div>

          {/* Date */}
          <p
            className="text-white/60 font-light tracking-widest text-center mt-3"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.8rem)" }}
          >
            {dateStr}
          </p>
          <p
            className="text-white/40 tracking-widest"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.4rem)" }}
          >
            {yearStr}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 mx-8 h-px bg-white/10" />

      {/* Weather current conditions — flex section that can shrink */}
      <div className="flex flex-col items-center justify-center flex-[3] min-h-0 px-8 gap-2">
        {weather ? (
          <div className="flex flex-col items-center gap-2">
            <span
              style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}
              role="img"
            >
              {wmoIcon(weather.weatherCode)}
            </span>
            <span
              className="text-white font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6vw, 7rem)" }}
            >
              {weather.temp}&deg;
              <span
                className="text-white/40 font-light"
                style={{ fontSize: "clamp(1.8rem, 2.5vw, 3rem)" }}
              >
                F
              </span>
            </span>
            <span
              className={`font-semibold tracking-wide ${labelColor}`}
              style={{ fontSize: "clamp(1.2rem, 1.8vw, 2rem)" }}
            >
              {weather.description}
            </span>
            <span
              className="text-white/50 mt-1"
              style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.4rem)" }}
            >
              Feels {weather.feelsLike}&deg; &nbsp;&middot;&nbsp; H:{weather.high}&deg; L:{weather.low}&deg;
            </span>
          </div>
        ) : (
          <p className="text-white/40 text-2xl">
            {weatherError ? "Weather unavailable" : "Loading weather..."}
          </p>
        )}
      </div>

      {/* 5-day forecast — shrink-0 so it is NEVER clipped */}
      {weather && (
        <div className="shrink-0 flex justify-center gap-2 px-6 py-4 border-t border-white/10 backdrop-blur-sm bg-white/[0.02]">
          {weather.forecast.map((day, i) => (
            <ForecastDay
              key={day.label}
              label={day.label}
              high={day.high}
              low={day.low}
              weatherCode={day.weatherCode}
              active={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
