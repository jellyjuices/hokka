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

  // WebKit holds one WebAuthn request per page and cannot be talked out of it, so
  // a second prompt raised over a live one never resolves and takes the screen
  // with it. One at a time is the whole rule. A prompt nobody asked for also says
  // nothing when it fails, because an error over an untouched screen reads as a
  // refusal of a password that was never typed.
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

  // A hidden tab raises a prompt nobody is there to answer, and that one blocks
  // the prompt they will ask for when they come back.
  useEffect(() => {
    if (!isEnrolled || hasTried.current || document.visibilityState === "hidden") return;
    hasTried.current = true;
    void attempt(true);
  }, [attempt, isEnrolled]);

  return { isEnrolled, status, error, attempt };
}
