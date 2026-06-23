"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchWeather, wmoCategory, wmoIcon } from "@/lib/weather";
import type { WeatherData, Event } from "@/lib/types";

const WEATHER_BG: Record<string, string> = {
  clear: "from-sky-100/80 via-cyan-50/60 to-slate-100",
  cloudy: "from-slate-200/80 via-slate-100/60 to-slate-50",
  fog: "from-slate-200/80 via-slate-150/60 to-slate-50",
  rain: "from-blue-100/80 via-slate-100/60 to-slate-50",
  snow: "from-sky-100/80 via-blue-50/60 to-slate-50",
  storm: "from-purple-100/80 via-slate-100/60 to-slate-50",
};

const WEATHER_COLOR: Record<string, string> = {
  clear: "text-cyan-700",
  cloudy: "text-slate-600",
  fog: "text-slate-500",
  rain: "text-blue-600",
  snow: "text-sky-600",
  storm: "text-purple-600",
};

function ForecastDay({
  label, high, low, weatherCode, active,
}: {
  label: string; high: number; low: number; weatherCode: number; active?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all ${active ? "bg-white/50 ring-2 ring-slate-300" : ""}`}>
      <span
        className="text-slate-500 font-medium"
        style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}
      >
        {label}
      </span>
      <span style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.2rem)" }} role="img">
        {wmoIcon(weatherCode)}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-slate-400 font-medium" style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)" }}>H</span>
        <span className="text-slate-800 font-bold" style={{ fontSize: "clamp(1.2rem, 1.8vw, 2rem)" }}>{high}&deg;</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-slate-400 font-medium" style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)" }}>L</span>
        <span className="text-slate-500" style={{ fontSize: "clamp(1rem, 1.5vw, 1.6rem)" }}>{low}&deg;</span>
      </div>
    </div>
  );
}

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

function getCountdown(now: Date, events: Event[]): { title: string; label: string } | null {
  for (const event of events) {
    const eventTime = event.time
      ? new Date(`${event.date}T${event.time}:00`)
      : new Date(`${event.date}T00:00:00`);
    const diff = eventTime.getTime() - now.getTime();
    if (diff <= 0) continue;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let label: string;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      label = days === 1 ? "Tomorrow" : `in ${days} days`;
      if (event.time) {
        const h = parseInt(event.time.split(":")[0]);
        const m = event.time.split(":")[1];
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        label += ` at ${h12}:${m} ${ampm}`;
      }
    } else if (hours > 0) {
      label = `in ${hours}h ${mins}m`;
    } else {
      label = `in ${mins}m`;
    }

    return { title: event.title, label };
  }
  return null;
}

export default function ClockWeatherPanel({ events = [] }: { events?: Event[] }) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);

  // Only re-render when the displayed minute changes (not every second).
  // Checks once per second but skips setState when the minute hasn't rolled over.
  useEffect(() => {
    let lastMinute = time.getMinutes();
    const tick = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        setTime(now);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const greeting = getGreeting(hours);
  const nextEvent = useMemo(() => getCountdown(time, events), [
    // recalc every minute (not every second)
    Math.floor(time.getTime() / 60000),
    events,
  ]);

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-b ${bg} transition-all duration-3000 border-r-2 border-slate-200 overflow-hidden`}
    >
      {/* Clock + UTC — flex section that can shrink */}
      <div className="flex flex-col items-center justify-center flex-[3] min-h-0 px-8 gap-2">
        <div className="flex flex-col items-center">
          {/* Greeting */}
          <p
            className="text-slate-400 font-light tracking-widest mb-2"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.8rem)" }}
          >
            {greeting}
          </p>
          {/* Local time */}
          <div className="flex items-start leading-none">
            <span
              className="text-slate-800 font-black tabular-nums"
              style={{ fontSize: "clamp(5rem, 9vw, 9rem)" }}
            >
              {h12}:{mins}
            </span>
            <span
              className="text-slate-400 font-light ml-3 mt-3"
              style={{ fontSize: "clamp(1.8rem, 2.5vw, 3rem)" }}
            >
              {ampm}
            </span>
          </div>

          {/* UTC time */}
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-teal-500 font-mono tracking-wider"
              style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              UTC {utcH}:{utcM}
            </span>
          </div>

          {/* Date */}
          <p
            className="text-slate-500 font-light tracking-widest text-center mt-3"
            style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.8rem)" }}
          >
            {dateStr}
          </p>
          <p
            className="text-slate-400 tracking-widest"
            style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)" }}
          >
            {yearStr}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0 mx-8 h-[2px] bg-slate-200" />

      {/* Next event countdown */}
      {nextEvent && (
        <div className="shrink-0 flex flex-col items-center gap-1 px-8 py-4 bg-teal-50 border-b-2 border-slate-200">
          <p
            className="text-teal-600 font-semibold tracking-wider uppercase"
            style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.4rem)" }}
          >
            Next Up
          </p>
          <p
            className="text-slate-700 font-semibold text-center leading-snug line-clamp-1"
            style={{ fontSize: "clamp(1.3rem, 1.8vw, 1.8rem)" }}
          >
            {nextEvent.title}
          </p>
          <p
            className="text-teal-500 font-mono"
            style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}
          >
            {nextEvent.label}
          </p>
        </div>
      )}

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
              className="text-slate-800 font-black leading-none"
              style={{ fontSize: "clamp(3.5rem, 6vw, 7rem)" }}
            >
              {weather.temp}&deg;
              <span
                className="text-slate-400 font-light"
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
              className="text-slate-400 mt-1"
              style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)" }}
            >
              Feels {weather.feelsLike}&deg; &nbsp;&middot;&nbsp; H:{weather.high}&deg; L:{weather.low}&deg;
            </span>
          </div>
        ) : (
          <p className="text-slate-400 text-2xl">
            {weatherError ? "Weather unavailable" : "Loading weather..."}
          </p>
        )}
      </div>

      {/* 5-day forecast — shrink-0 so it is NEVER clipped */}
      {weather && (
        <div className="shrink-0 flex justify-center gap-2 px-6 py-4 border-t-2 border-slate-200 backdrop-blur-sm bg-white/60">
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
