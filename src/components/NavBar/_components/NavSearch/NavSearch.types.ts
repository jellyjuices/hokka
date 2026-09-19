import type { RefObject } from "react";

export type NavSearchProps = {
  isCollapsed: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onActivate: () => void;
};
