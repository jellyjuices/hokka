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
  const pending = useRef<AbortController | null>(null);
  const hasPrompted = useRef(false);

  // A request still in flight blocks the next one, so a stale prompt is
  // cancelled rather than waited on. Every attempt is a real attempt.
  const attempt = useCallback(async () => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    hasPrompted.current = true;
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

  // Safari 17.4 and macOS 14.4 dropped the user gesture WebAuthn used to demand
  // and rate-limit the call instead, so arrival can raise the sheet itself. A home
  // screen launch carries no gesture at all, which is why waiting for one left a
  // standalone app on the password field. An older device refuses the ungestured
  // call, falls through to the error, and the button below still carries it.
  useEffect(() => {
    if (!isEnrolled || hasPrompted.current) return;
    void attempt();
  }, [attempt, isEnrolled]);

  useEffect(() => {
    return () => {
      if (pending.current === null) return;
      pending.current.abort();
      pending.current = null;
      hasPrompted.current = false;
    };
  }, []);

  return { isEnrolled, status, error, attempt };
}
