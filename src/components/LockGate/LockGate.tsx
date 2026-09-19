"use client";

import { useSyncExternalStore } from "react";
import {
  getUnlockedServerSnapshot,
  getUnlockedSnapshot,
  subscribeUnlocked,
  writeUnlocked,
} from "@/src/lib/platform/unlocked";
import { PinForm } from "./_components/PinForm";
import type { LockGateProps } from "./LockGate.types";

export function LockGate({ children }: LockGateProps) {
  const isUnlocked = useSyncExternalStore(
    subscribeUnlocked,
    getUnlockedSnapshot,
    getUnlockedServerSnapshot,
  );

  if (isUnlocked === null) return null;
  if (!isUnlocked) return <PinForm onUnlocked={writeUnlocked} />;
  return <>{children}</>;
}
