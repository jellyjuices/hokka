import type { ReactNode } from "react";

export type ListRowProps = {
  meta?: ReactNode;
  title: string;
  value: string;
  href?: string;
};
