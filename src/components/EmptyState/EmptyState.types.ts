import type { ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
};
