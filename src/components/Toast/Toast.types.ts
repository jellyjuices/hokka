export type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  tone: ToastTone;
  message: string;
  description?: string;
  key?: string;
};

export type ToastRecord = ToastInput & {
  id: string;
};

export type ToastProps = {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
};

export type ToastStackProps = {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
};
