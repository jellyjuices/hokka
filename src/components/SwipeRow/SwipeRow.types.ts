import type { ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type SwipeRowProps = {
  actionIcon: IconName;
  actionLabel: string;
  onAction: () => void;
  isEnabled?: boolean;
  children: ReactNode;
};
