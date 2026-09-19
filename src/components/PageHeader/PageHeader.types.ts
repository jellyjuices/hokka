import type { ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type PageHeaderProps = {
  title: string;
  backHref?: string;
  mobileTitle?: string;
  description?: string;
  icon?: IconName;
  meta?: ReactNode;
  action?: ReactNode;
};
