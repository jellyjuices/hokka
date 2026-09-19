"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOVER_INTENT_MS = 1000;

export function useNavCollapse() {
  const [isExpanded, setIsExpanded] = useState(false);
  const railRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const collapse = useCallback(() => {
    clearTimer();
    setIsExpanded(false);
  }, [clearTimer]);

  const hoverEnd = useCallback(() => {
    const rail = railRef.current;
    if (rail && document.activeElement && rail.contains(document.activeElement)) {
      clearTimer();
      return;
    }
    collapse();
  }, [clearTimer, collapse]);

  const peek = useCallback(() => {
    clearTimer();
    setIsExpanded(true);
  }, [clearTimer]);

  const hoverStart = useCallback(() => {
    if (isExpanded || timerRef.current !== null) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsExpanded(true);
    }, HOVER_INTENT_MS);
  }, [isExpanded]);

  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!isExpanded) return undefined;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && railRef.current?.contains(target)) return;
      collapse();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") collapse();
    }

    function handleFocusOut(event: FocusEvent) {
      const next = event.relatedTarget as Node | null;
      if (next && railRef.current?.contains(next)) return;
      collapse();
    }

    const rail = railRef.current;
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    rail?.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      rail?.removeEventListener("focusout", handleFocusOut);
    };
  }, [isExpanded, collapse]);

  return { isCollapsed: !isExpanded, railRef, peek, hoverStart, hoverEnd };
}
