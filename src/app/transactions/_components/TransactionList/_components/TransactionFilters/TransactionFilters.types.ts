import type { TransactionFilter } from "@/src/lib/filters";

export type TransactionFiltersProps = {
  filter: TransactionFilter;
  years: string[];
  resultCount: number;
  onChange: (filter: TransactionFilter) => void;
};
