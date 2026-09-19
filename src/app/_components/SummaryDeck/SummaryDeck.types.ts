import type { ReactNode, RefObject } from "react";

export type SummaryDeckProps = {
  label: string;
  trackRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};
