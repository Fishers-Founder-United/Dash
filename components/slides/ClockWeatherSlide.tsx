"use client";

import { useEffect, useState } from "react";
import { fetchWeather, wmoCategory } from "@/lib/weather";
import type { WeatherData } from "@/lib/types";

const WEATHER_BG: Record<string, string> = {
  clear: "from-amber-900/40 to-sky-900/60",
  cloudy: "from-slate-800/60 to-slate-900/60",
  fog: "from-slate-700/60 to-slate-800/60",
  rain: "from-blue-900/60 to-slate-900/60",
  snow: "from-sky-800/50 to-slate-900/60",
  storm: "from-purple-900/60 to-slate-900/80",
};

const WEATHER_LABEL_COLOR: Record<string, string> = {
  clear: "text-amber-300",
  cloudy: "text-slate-300",
  fog: "text-slate-400",
  rain: "text-blue-300",
  snow: "text-sky-200",
  storm: "text-purple-300",
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
      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl ${current ? "bg-white/10" : ""}`}
    >
      <span className="text-white/60 text-xl font-medium">{label}</span>
      <span className="text-white text-3xl font-bold">{high}&deg;</span>
      <span className="text-white/50 text-2xl">{low}&deg;</span>
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
  const labelColor = WEATHER_LABEL_COLOR[category] ?? "text-amber-300";

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
          <span className="text-white font-bold leading-none"
            style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}>
            {timePart}
          </span>
          <span className="text-white/60 font-light mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}>
            {ampm}
          </span>
        </div>
        <p className="text-white/70 font-light tracking-widest uppercase"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)" }}>
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
                className="text-white font-bold leading-none"
                style={{ fontSize: "clamp(4rem, 12vw, 11rem)" }}
              >
                {weather.temp}&deg;F
              </span>
              <span className={`font-semibold tracking-wide ${labelColor}`}
                style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)" }}>
                {weather.description}
              </span>
              <span className="text-white/50 mt-1"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.8rem)" }}>
                Feels like {weather.feelsLike}&deg; &nbsp;|&nbsp; H:{weather.high}&deg; L:{weather.low}&deg;
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-40 bg-white/20" />

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

          <p className="text-white/30 text-xl tracking-widest uppercase">
            Fishers, Indiana
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center pb-12">
          <span className="text-white/30 text-3xl">Loading weather...</span>
        </div>
      )}
    </div>
  );
}
