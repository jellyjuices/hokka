import type { ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type StatTileVariant = "secondary" | "primary";
export type StatTileSize = "display" | "compact";

export type StatTileProps = {
  label: string;
  value: ReactNode;
  caption?: string;
  icon?: IconName;
  variant?: StatTileVariant;
  size?: StatTileSize;
  badge?: ReactNode;
};
