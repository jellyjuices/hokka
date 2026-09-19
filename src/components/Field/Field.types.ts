import type { ChangeEventHandler, ReactNode } from "react";

export type FieldProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export type TextInputProps = {
  id: string;
  name: string;
  type?: "text" | "number" | "date" | "password";
  placeholder?: string;
  defaultValue?: string | number;
  value?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};
