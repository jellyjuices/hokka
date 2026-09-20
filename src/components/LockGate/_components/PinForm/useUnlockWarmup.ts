"use client";

import { useEffect } from "react";
import { hydrateRepository } from "@/src/data/repository";
import { warmUnlock } from "./PinForm.verify";

export function useUnlockWarmup() {
  useEffect(() => {
    warmUnlock();
    void hydrateRepository();
  }, []);
}
