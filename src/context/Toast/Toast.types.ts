import type { ReactNode } from "react";
import type { ToastInput } from "@/src/components/Toast";

export type ToastProviderProps = {
  children: ReactNode;
};

export type ToastActionsValue = {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};
