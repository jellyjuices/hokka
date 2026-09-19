import type { ElementType, ReactNode } from "react";

export type GridProps = {
  as?: ElementType;
  children: ReactNode;
};

export type GridItemProps = {
  span?: number;
  spanTablet?: number;
  spanMobile?: number;
  rowSpan?: number;
  children: ReactNode;
};
