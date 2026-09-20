import type { ReactNode } from "react";

export type CardWrapperDirection = "row" | "column";

export type CardWrapperProps = {
  children: ReactNode;
  direction?: CardWrapperDirection;
  stackOnMobile?: boolean;
  className?: string;
};
