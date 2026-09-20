"use client";

import { Toast } from "./Toast";
import { ToastViewport } from "./Toast.styles";
import type { ToastStackProps } from "./Toast.types";

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <ToastViewport aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </ToastViewport>
  );
}
