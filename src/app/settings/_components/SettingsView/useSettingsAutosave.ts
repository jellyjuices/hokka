"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useLedger, useLedgerActions } from "@/src/context/Ledger";
import { readSettingsPatch } from "./SettingsView.patch";

const SAVE_DELAY = 600;

export function useSettingsAutosave(formRef: RefObject<HTMLFormElement | null>) {
  const { settings, isHydrated } = useLedger();
  const { updateSettings } = useLedgerActions();
  const [pending, setPending] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(settings);
  const isReady = useRef(isHydrated);

  useEffect(() => {
    latest.current = settings;
    isReady.current = isHydrated;
  }, [isHydrated, settings]);

  const save = useCallback(async () => {
    const form = formRef.current;
    if (form === null || !isReady.current) return;
    const patch = readSettingsPatch(new FormData(form), latest.current);
    setPending((count) => count + 1);
    await updateSettings(patch);
    setPending((count) => count - 1);
  }, [formRef, updateSettings]);

  const schedule = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void save();
    }, SAVE_DELAY);
  }, [save]);

  const flush = useCallback(() => {
    if (timer.current === null) return;
    clearTimeout(timer.current);
    timer.current = null;
    void save();
  }, [save]);

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  return { isSaving: pending > 0, schedule, flush };
}
