import type { RefObject } from "react";

export type NavRailProps = {
  brand: string;
  initials: string;
  isCollapsed: boolean;
  railRef: RefObject<HTMLElement | null>;
  onPeek: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};
