"use client";

import { useEffect, useRef } from "react";

/**
 * Smoothly auto-scrolls a container from top to bottom over `duration` ms
 * using a cubic ease-in-out curve. Starts after a short delay so the
 * slide-in animation can settle first.
 */
export function useAutoScroll(
  itemCount: number,
  duration: number,
  /** Minimum items before scrolling kicks in (defaults to 5) */
  threshold = 5,
  /** Delay before scrolling starts in ms */
  startDelay = 800
) {
  const listRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el || itemCount < threshold) return;

    el.scrollTop = 0;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    let start: number | null = null;

    function step(ts: number) {
      if (!el) return;
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-in-out cubic
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      el.scrollTop = eased * maxScroll;
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    }

    const delay = setTimeout(() => {
      animRef.current = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(delay);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [itemCount, duration, threshold, startDelay]);

  return listRef;
}
