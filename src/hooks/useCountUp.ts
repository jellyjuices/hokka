"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

const DURATION_MS = 500;

function easeOut(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function useCountUp(value: number) {
  const prefersReducedMotion = useReducedMotion();
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      shownRef.current = value;
      return undefined;
    }

    const from = shownRef.current;
    if (from === value) return undefined;

    let frame = 0;
    let startedAt = 0;

    function step(now: number) {
      if (startedAt === 0) startedAt = now;
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      const next = from + (value - from) * easeOut(progress);
      shownRef.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion, value]);

  return prefersReducedMotion ? value : shown;
}
