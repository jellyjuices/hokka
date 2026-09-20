"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ToastStack } from "@/src/components/Toast";
import type { ToastInput, ToastRecord } from "@/src/components/Toast";
import { newId } from "@/src/lib/platform/id";
import type { ToastActionsValue, ToastProviderProps } from "./Toast.types";

const MAX_VISIBLE = 3;

const ToastContext = createContext<ToastActionsValue | null>(null);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    setToasts((current) => {
      const kept = toast.key ? current.filter((entry) => entry.key !== toast.key) : current;
      return [...kept, { ...toast, id: newId() }].slice(-MAX_VISIBLE);
    });
  }, []);

  const actions = useMemo<ToastActionsValue>(
    () => ({ showToast, dismissToast }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={actions}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
