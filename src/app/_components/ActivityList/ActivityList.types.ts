import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

export type ActivityVisibility = "all" | "wide" | "narrow";

export type ActivityItem = {
  id: string;
  meta: ReactNode;
  title: string;
  value: string;
  href?: string;
};

export type ActivityListProps = {
  title: string;
  items: ActivityItem[];
  emptyTitle: string;
  emptyDescription?: string;
  ctaHref: string;
  ctaLabel: string;
  visibility?: ActivityVisibility;
  icon?: Icon;
};
