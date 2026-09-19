import type { MouseEventHandler, ReactNode } from "react";

export type TileInputProps = {
  children: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};
