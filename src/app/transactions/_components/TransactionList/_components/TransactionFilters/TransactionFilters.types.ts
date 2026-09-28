import type { ReactNode } from "react";
import type { TransactionFilter } from "@/src/lib/filters";

export type TransactionFiltersProps = {
  filter: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
  action?: ReactNode;
};
