import type { ReactNode } from "react";

export type TakeoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmLabel?: string;
  onConfirm: () => void;
  children: ReactNode;
};

export type ChoiceOption = {
  value: string;
  label: string;
  leading?: ReactNode;
};

export type ChoiceTakeoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: string;
  options: ChoiceOption[];
  onConfirm: (value: string) => void;
};
