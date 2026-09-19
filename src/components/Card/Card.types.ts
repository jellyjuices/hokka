import type { ReactNode } from "react";

export type CardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
};
