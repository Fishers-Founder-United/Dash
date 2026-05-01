"use client";

import { useState } from "react";
import { randomJoke } from "@/lib/iotJokes";

export default function FunFactSlide() {
  // Pick a new joke each time the slide mounts
  const [joke] = useState(() => randomJoke());

  const isFact = joke.startsWith("Fun fact:");
  const icon = isFact ? "\uD83D\uDCA1" : "\uD83E\uDD16"; // 💡 or 🤖

  return (
    <div className="flex flex-col h-full px-16 py-12">
      {/* Header */}
      <div className="shrink-0">
        <h2
          className="text-cyan-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
        >
          {isFact ? "Did You Know?" : "IoT Humor Protocol"}
        </h2>
        <p className="text-white/40 text-2xl mt-1">
          {isFact
            ? "Expanding your knowledge buffer"
            : "Laughter.emit() — no subscription required"}
        </p>
      </div>

      <div className="h-px bg-cyan-500/20 mt-6" />

      {/* Joke / fact — centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-5xl mx-auto">
        {/* Icon */}
        <span style={{ fontSize: "clamp(4rem, 7vw, 8rem)" }}>
          {icon}
        </span>

        {/* Text */}
        <p
          className="text-white text-center leading-relaxed font-medium"
          style={{ fontSize: "clamp(1.8rem, 3vw, 3.2rem)" }}
        >
          {joke}
        </p>

        {/* Cheeky footer */}
        <p
          className="text-cyan-400/40 text-center font-mono"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
        >
          — Indiana IoT Lab &middot; where even the coffee maker has an IP address
        </p>
      </div>
    </div>
  );
}
