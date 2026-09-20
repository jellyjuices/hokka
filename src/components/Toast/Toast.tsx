"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon, InfoIcon, WarningIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import type { IconName } from "@/src/components/Icon";
import { useSwipeDismiss } from "@/src/hooks";
import {
  ToastBody,
  ToastCard,
  ToastClose,
  ToastDetail,
  ToastGlyph,
  ToastMessage,
} from "./Toast.styles";
import type { ToastProps, ToastTone } from "./Toast.types";

const TONE_ICON: Record<ToastTone, IconName> = {
  success: CheckCircleIcon,
  error: WarningIcon,
  info: InfoIcon,
};

const TONE_LIFETIME_MS: Record<ToastTone, number> = {
  success: 4000,
  error: 7000,
  info: 5000,
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const dismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);
  const { rootRef, isDragging, onPointerDown, onPointerMove, onPointerEnd } = useSwipeDismiss({
    onDismiss: dismiss,
  });

  useEffect(() => {
    if (isPaused || isDragging) return undefined;
    const timerId = window.setTimeout(dismiss, TONE_LIFETIME_MS[toast.tone]);
    return () => window.clearTimeout(timerId);
  }, [dismiss, isDragging, isPaused, toast.tone]);

  return (
    <ToastCard
      ref={rootRef}
      role={toast.tone === "error" ? "alert" : "status"}
      $tone={toast.tone}
      $isDragging={isDragging}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <ToastGlyph $tone={toast.tone}>
        <Icon name={TONE_ICON[toast.tone]} size={20} />
      </ToastGlyph>
      <ToastBody>
        <ToastMessage>{toast.message}</ToastMessage>
        {toast.description && <ToastDetail>{toast.description}</ToastDetail>}
      </ToastBody>
      <ToastClose type="button" aria-label="Dismiss" onClick={dismiss}>
        <Icon name={XIcon} size={16} />
      </ToastClose>
    </ToastCard>
  );
}
