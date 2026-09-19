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

// A prompt raised without a fresh gesture is not refused so much as swallowed:
// the sheet never opens and the promise never settles, which left the screen
// waiting on a prompt nobody was ever shown. So arrival raises it only while the
// tap that brought you here still counts, and the button carries it otherwise.
function hasFreshGesture() {
  return navigator.userActivation.isActive;
}

export function useBiometricUnlock(onUnlocked: () => void) {
  const isEnrolled = useSyncExternalStore(
    subscribeBiometrics,
    getBiometricsSnapshot,
    getBiometricsServerSnapshot,
  );
  const [status, setStatus] = useState<BiometricStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const pending = useRef<AbortController | null>(null);
  const hasPrompted = useRef(false);

  // A request still in flight blocks the next one, so a stale prompt is
  // cancelled rather than waited on. Every attempt is a real attempt.
  const attempt = useCallback(async () => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setStatus("prompting");
    setError(null);
    const message = await unlockWithBiometrics(controller.signal);
    if (controller.signal.aborted) return;
    pending.current = null;
    if (message === null && (await hasLiveSession())) {
      onUnlocked();
      return;
    }
    setError(message ?? "This session has expired. Enter your password");
    setStatus("failed");
  }, [onUnlocked]);

  useEffect(() => {
    if (isEnrolled && !hasPrompted.current && hasFreshGesture()) {
      hasPrompted.current = true;
      void attempt();
    }
    return () => {
      if (pending.current === null) return;
      pending.current.abort();
      pending.current = null;
      hasPrompted.current = false;
    };
  }, [attempt, isEnrolled]);

  return { isEnrolled, status, error, attempt };
}
