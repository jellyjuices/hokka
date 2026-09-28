import type { ReactNode } from "react";
import { Icon } from "@phosphor-icons/react";

export type PageHeaderProps = {
  title: string;
  backHref?: string;
  mobileTitle?: string;
  description?: string;
  icon?: Icon;
  meta?: ReactNode;
  action?: ReactNode;
};
