import type { ReactNode } from "react";
import type { Category } from "@/src/data/categories";
import type { TransactionFilter } from "@/src/lib/filters";

export type TransactionFiltersProps = {
  filter: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
  action?: ReactNode;
};

export type FilterFieldsProps = {
  filter: TransactionFilter;
  categories: Category[];
  onChange: (filter: TransactionFilter) => void;
};
