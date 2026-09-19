"use client";

import { useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark";

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): ThemeMode {
  const override = document.documentElement.dataset.theme;
  if (override === "light" || override === "dark") return override;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useThemeMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light" as ThemeMode);
}
