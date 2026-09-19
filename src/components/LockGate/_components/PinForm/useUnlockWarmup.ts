"use client";

import { useEffect } from "react";
import { hydrateRepository } from "@/src/data/repository";
import { warmUnlock } from "./PinForm.verify";

// Neither of these needs the password: the mirror is this device reading its own
// storage, and the ping only wakes the instance that will be asked. Starting both
// while the password is being typed keeps them off the far side of the unlock.
export function useUnlockWarmup() {
  useEffect(() => {
    warmUnlock();
    void hydrateRepository();
  }, []);
}
