"use client";

import { useEffect, useState } from "react";
import { fetchWeather, wmoCategory } from "@/lib/weather";
import type { WeatherData } from "@/lib/types";

const WEATHER_BG: Record<string, string> = {
  clear: "from-sky-100/60 to-cyan-50/60",
  cloudy: "from-slate-200/60 to-slate-100/60",
  fog: "from-slate-200/60 to-slate-100/60",
  rain: "from-blue-100/60 to-slate-100/60",
  snow: "from-sky-100/50 to-slate-100/60",
  storm: "from-purple-100/60 to-slate-100/80",
};

const WEATHER_LABEL_COLOR: Record<string, string> = {
  clear: "text-cyan-700",
  cloudy: "text-slate-600",
  fog: "text-slate-500",
  rain: "text-blue-600",
  snow: "text-sky-600",
  storm: "text-purple-600",
};

function WeatherBar({
  label,
  high,
  low,
  current,
}: {
  label: string;
  high: number;
  low: number;
  current?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl ${current ? "bg-white/50" : ""}`}
    >
      <span className="text-slate-500 font-medium" style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}>{label}</span>
      <span className="text-slate-800 font-bold" style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}>{high}&deg;</span>
      <span className="text-slate-400" style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}>{low}&deg;</span>
    </div>
  );
}

export default function ClockWeatherSlide() {
  const [time, setTime] = useState<Date>(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    fetchWeather().then(setWeather);
    const refresh = setInterval(() => fetchWeather().then(setWeather), 30 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  const category = weather ? wmoCategory(weather.weatherCode) : "clear";
  const bg = WEATHER_BG[category] ?? WEATHER_BG.clear;
  const labelColor = WEATHER_LABEL_COLOR[category] ?? "text-cyan-300";

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const [timePart, ampm] = timeStr.split(" ");

  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br ${bg} transition-all duration-1000`}
    >
      {/* Top half: Clock */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex items-end gap-6">
          <span className="text-slate-800 font-bold leading-none"
            style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}>
            {timePart}
          </span>
          <span className="text-slate-400 font-light mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}>
            {ampm}
          </span>
        </div>
        <p className="text-slate-500 font-light tracking-widest uppercase"
          style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}>
          {dateStr}
        </p>
      </div>

      {/* Bottom half: Weather */}
      {weather ? (
        <div className="flex flex-col items-center pb-6 px-8 gap-4">
          <div className="flex items-center gap-10">
            {/* Current temp */}
            <div className="flex flex-col items-center">
              <span
                className="text-slate-800 font-bold leading-none"
                style={{ fontSize: "clamp(4rem, 12vw, 11rem)" }}
              >
                {weather.temp}&deg;F
              </span>
              <span className={`font-semibold tracking-wide ${labelColor}`}
                style={{ fontSize: "clamp(2rem, 2.5vw, 3rem)" }}>
                {weather.description}
              </span>
              <span className="text-slate-400 mt-1"
                style={{ fontSize: "clamp(1.8rem, 2vw, 2.5rem)" }}>
                Feels like {weather.feelsLike}&deg; &nbsp;|&nbsp; H:{weather.high}&deg; L:{weather.low}&deg;
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-40 bg-slate-200" />

            {/* Forecast */}
            <div className="flex gap-3">
              {weather.forecast.map((day, i) => (
                <WeatherBar
                  key={day.label}
                  label={day.label}
                  high={day.high}
                  low={day.low}
                  current={i === 0}
                />
              ))}
            </div>
          </div>

          <p className="text-slate-300 tracking-widest uppercase" style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}>
            Indiana IoT Lab &nbsp;·&nbsp; Fishers, IN
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center pb-12">
          <span className="text-slate-300 text-3xl">Loading weather...</span>
        </div>
      )}
    </div>
  );
}
