import type { ReactNode } from "react";

export type FieldProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export type TextInputProps = {
  id: string;
  name: string;
  type?: "text" | "number" | "date";
  placeholder?: string;
  defaultValue?: string | number;
};
