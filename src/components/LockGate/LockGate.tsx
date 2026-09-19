"use client";

import { useSyncExternalStore } from "react";
import { isDevUnlocked } from "@/src/lib/devUnlock";
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

  if (isDevUnlocked()) return <>{children}</>;
  if (isUnlocked === null) return null;
  if (!isUnlocked) return <PinForm onUnlocked={writeUnlocked} />;
  return <>{children}</>;
}
