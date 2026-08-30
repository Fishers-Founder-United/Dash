"use client";

import { useState } from "react";
import { randomJoke } from "@/lib/iotJokes";
import SlideHeader from "./SlideHeader";

export default function FunFactSlide() {
  // Pick a new joke each time the slide mounts
  const [joke] = useState(() => randomJoke());

  const isFact = joke.startsWith("Fun fact:");
  const icon = isFact ? "\uD83D\uDCA1" : "\uD83E\uDD16"; // 💡 or 🤖

  return (
    <div className="flex flex-col h-full px-16 py-12">
      <SlideHeader
        channel={isFact ? "Buffer · Knowledge" : "stdout · Humor Protocol"}
        title={isFact ? "Did You Know?" : "IoT Humor Protocol"}
        meta={isFact ? "KNOWLEDGE.READ()" : "LAUGHTER.EMIT()"}
      />

      {/* Joke / fact — centered in remaining space */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-5xl mx-auto">
        {/* Icon */}
        <span style={{ fontSize: "clamp(4rem, 7vw, 8rem)" }}>
          {icon}
        </span>

        {/* Text */}
        <p
          className="text-[var(--ink)] text-center leading-relaxed font-medium"
          style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
        >
          {joke}
        </p>

        {/* Cheeky footer */}
        <p
          className="mono text-[var(--accent)] text-center tracking-[0.06em]"
          style={{ fontSize: "clamp(1.5rem, 1.8vw, 2rem)" }}
        >
          — Indiana IoT Lab &middot; where even the coffee maker has an IP address
        </p>
      </div>
    </div>
  );
}
