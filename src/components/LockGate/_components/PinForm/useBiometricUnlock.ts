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
  const isBusy = useRef(false);
  const hasTried = useRef(false);

  const attempt = useCallback(
    async (isSilent: boolean) => {
      if (isBusy.current) return;
      isBusy.current = true;
      setStatus("prompting");
      setError(null);
      const message = await unlockWithBiometrics();
      isBusy.current = false;
      if (message === null && (await hasLiveSession())) {
        onUnlocked();
        return;
      }
      setStatus("failed");
      if (isSilent) return;
      setError(message ?? "This session has expired. Enter your password");
    },
    [onUnlocked],
  );

  useEffect(() => {
    if (!isEnrolled || hasTried.current || document.visibilityState === "hidden") return;
    hasTried.current = true;
    void attempt(true);
  }, [attempt, isEnrolled]);

  return { isEnrolled, status, error, attempt };
}
