"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/lib/types";

interface PhotoSlideProps {
  photos: Photo[];
}

export default function PhotoSlide({ photos }: PhotoSlideProps) {
  const [photoIdx, setPhotoIdx] = useState(0);

  // Cycle through photos every 6 seconds within the slide
  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setPhotoIdx((i) => (i + 1) % photos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Reset index when photos change
  useEffect(() => {
    setPhotoIdx(0);
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-white/40 text-2xl">No photos yet</p>
      </div>
    );
  }

  const photo = photos[photoIdx % photos.length];

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Photo */}
      <img
        key={photo.id}
        src={photo.src}
        alt={photo.caption}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      />

      {/* Gradient overlay at bottom for caption legibility */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Caption bar */}
      <div className="absolute inset-x-0 bottom-0 px-12 py-8 flex items-end justify-between">
        <div className="flex-1">
          <p
            className="text-white font-semibold leading-snug"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.4rem)" }}
          >
            {photo.caption}
          </p>
        </div>
        {photos.length > 1 && (
          <div className="flex gap-2 ml-8 shrink-0">
            {photos.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === photoIdx % photos.length
                    ? "bg-cyan-400 scale-125"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header overlay */}
      <div className="absolute top-0 inset-x-0 px-12 py-8 bg-gradient-to-b from-black/60 to-transparent">
        <h2
          className="text-cyan-400 font-black tracking-widest uppercase"
          style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
        >
          Life at the Lab
        </h2>
      </div>
    </div>
  );
}
