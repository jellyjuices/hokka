import type { Icon } from "@phosphor-icons/react";
import type { Filing, Transaction } from "@/src/data/domain.types";

export type ActivityVisibility = "all" | "wide" | "narrow";

export type ActivityItem =
  { kind: "transaction"; transaction: Transaction } | { kind: "filing"; filing: Filing };

export type ActivityListProps = {
  title: string;
  items: ActivityItem[];
  emptyTitle: string;
  emptyDescription?: string;
  ctaHref: string;
  ctaLabel: string;
  visibility?: ActivityVisibility;
  icon?: Icon;
  isLoading?: boolean;
};
