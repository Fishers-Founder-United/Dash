"use client";

import { useEffect, useState } from "react";
import type { StatsData } from "@/lib/types";

interface CommunityStatsSlideProps {
  stats: StatsData;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      // ease-out curve
      const progress = 1 - Math.pow(1 - step / steps, 3);
      current = Math.round(value * progress);
      setDisplay(current);
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

function StatCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl px-10 py-8 flex-1">
      <span
        className="text-cyan-400 font-black tabular-nums"
        style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
      >
        <AnimatedNumber value={value} suffix={suffix} />
      </span>
      <span
        className="text-white/60 font-semibold tracking-widest uppercase text-center"
        style={{ fontSize: "clamp(1rem, 1.6vw, 1.6rem)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CommunityStatsSlide({ stats }: CommunityStatsSlideProps) {
  const yearsActive = new Date().getFullYear() - stats.yearFounded;

  return (
    <div className="flex flex-col h-full px-12 py-10 gap-6">
      {/* Header */}
      <div className="shrink-0">
        <h2
          className="text-cyan-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
        >
          By The Numbers
        </h2>
        <p
          className="text-white/45 mt-1"
          style={{ fontSize: "clamp(1rem, 1.6vw, 1.6rem)" }}
        >
          Indiana IoT Lab &middot; est. {stats.yearFounded}
        </p>
      </div>

      <div className="h-px bg-cyan-500/20 shrink-0" />

      {/* Stats grid */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="flex gap-8">
          <StatCard label="Member Companies" value={stats.members} suffix="+" />
          <StatCard label="Square Feet" value={stats.squareFeet} />
        </div>
        <div className="flex gap-8">
          <StatCard label="Companies Launched" value={stats.companiesLaunched} suffix="+" />
          <StatCard label="Jobs Created" value={stats.jobsCreated} suffix="+" />
          <StatCard label="Years of Innovation" value={yearsActive} />
        </div>
      </div>
    </div>
  );
}
