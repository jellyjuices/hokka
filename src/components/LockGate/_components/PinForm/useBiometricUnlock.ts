"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getBiometricsServerSnapshot,
  getBiometricsSnapshot,
  subscribeBiometrics,
  unlockWithBiometrics,
} from "@/src/lib/biometrics";
import { hasLiveSession } from "./PinForm.verify";
import type { BiometricStatus } from "./PinForm.types";

export function useBiometricUnlock(onUnlocked: () => void) {
  const isEnrolled = useSyncExternalStore(
    subscribeBiometrics,
    getBiometricsSnapshot,
    getBiometricsServerSnapshot,
  );
  const [status, setStatus] = useState<BiometricStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const hasPrompted = useRef(false);

  const attempt = useCallback(async () => {
    setStatus("prompting");
    setError(null);
    const message = await unlockWithBiometrics();
    if (message === null && (await hasLiveSession())) {
      onUnlocked();
      return;
    }
    setError(message ?? "This session has expired. Enter your password");
    setStatus("failed");
  }, [onUnlocked]);

  // The prompt is raised once, on arrival. Every later attempt is a real click,
  // which is also what a browser that demands a gesture will accept.
  useEffect(() => {
    if (!isEnrolled || hasPrompted.current) return;
    hasPrompted.current = true;
    void attempt();
  }, [attempt, isEnrolled]);

  return { isEnrolled, status, error, attempt };
}
