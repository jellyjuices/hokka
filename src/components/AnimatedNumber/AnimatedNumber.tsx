"use client";

import { useCountUp } from "@/src/hooks";
import type { AnimatedNumberProps } from "./AnimatedNumber.types";

export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const shown = useCountUp(value);
  return <>{format(shown)}</>;
}
