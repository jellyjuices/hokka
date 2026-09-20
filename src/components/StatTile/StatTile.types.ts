import type { ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type StatTileTone = "neutral" | "accent";
export type StatTileSize = "display" | "compact";

export type StatTileProps = {
  label: string;
  value: ReactNode;
  caption?: string;
  icon?: IconName;
  tone?: StatTileTone;
  size?: StatTileSize;
  badge?: ReactNode;
};
