"use client";

import { useSyncExternalStore } from "react";
import { PinForm } from "./_components/PinForm";
import {
  getUnlockedServerSnapshot,
  getUnlockedSnapshot,
  subscribeUnlocked,
  writeUnlocked,
} from "./LockGate.storage";
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
