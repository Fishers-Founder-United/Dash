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
      <span className="text-white/50 text-2xl font-medium">{label}</span>
      <span style={{ fontSize: "clamp(1.6rem, 2.8vw, 3rem)" }} role="img">
        {wmoIcon(weatherCode)}
      </span>
      <span className="text-white text-4xl font-bold">{high}&deg;</span>
      <span className="text-white/40 text-2xl">{low}&deg;</span>
    </div>
  );
}

export default function ClockWeatherPanel() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    fetchWeather().then(setWeather);
    const refresh = setInterval(
      () => fetchWeather().then(setWeather),
      30 * 60 * 1000
    );
    return () => clearInterval(refresh);
  }, []);

  const category = weather ? wmoCategory(weather.weatherCode) : "clear";
  const bg = WEATHER_BG[category] ?? WEATHER_BG.clear;
  const labelColor = WEATHER_COLOR[category] ?? "text-cyan-300";

  const hours = time.getHours();
  const mins = String(time.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const yearStr = time.getFullYear();

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b ${bg} transition-all duration-2000 border-r border-white/5`}
    >
      {/* Clock */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-8">
        {/* Time */}
        <div className="flex flex-col items-center">
          <div className="flex items-start leading-none">
            <span
              className="text-white font-black tabular-nums"
              style={{ fontSize: "clamp(6rem, 10vw, 12rem)" }}
            >
              {h12}:{mins}
            </span>
            <span
              className="text-white/50 font-light ml-3 mt-4"
              style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}
            >
              {ampm}
            </span>
          </div>
          <p
            className="text-white/60 font-light tracking-widest text-center mt-3"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 2rem)" }}
          >
            {dateStr}
          </p>
          <p
            className="text-white/25 tracking-widest"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.5rem)" }}
          >
            {yearStr}
          </p>
        </div>

        {/* Divider */}
        <div className="w-3/4 h-px bg-white/10 my-2" />

        {/* Weather */}
        {weather ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col items-center">
              <span
                style={{ fontSize: "clamp(3rem, 5vw, 6rem)" }}
                role="img"
              >
                {wmoIcon(weather.weatherCode)}
              </span>
              <span
                className="text-white font-black leading-none"
                style={{ fontSize: "clamp(4rem, 7vw, 9rem)" }}
              >
                {weather.temp}&deg;
                <span
                  className="text-white/40 font-light"
                  style={{ fontSize: "clamp(2rem, 3vw, 4rem)" }}
                >
                  F
                </span>
              </span>
              <span
                className={`font-semibold tracking-wide ${labelColor}`}
                style={{ fontSize: "clamp(1.2rem, 2vw, 2.2rem)" }}
              >
                {weather.description}
              </span>
              <span
                className="text-white/40 mt-1"
                style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.5rem)" }}
              >
                Feels {weather.feelsLike}&deg; &nbsp;·&nbsp; H:{weather.high}&deg; L:{weather.low}&deg;
              </span>
            </div>

            {/* 5-day forecast */}
            <div className="flex justify-center gap-2 w-full">
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
          </div>
        ) : (
          <p className="text-white/30 text-2xl">Loading weather...</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/5">
        <p className="text-white/20 text-xl text-center tracking-widest uppercase">
          Fishers, IN 46038
        </p>
        <p className="text-white/15 text-lg text-center">
          9059 Technology Lane
        </p>
      </div>
    </div>
  );
}
