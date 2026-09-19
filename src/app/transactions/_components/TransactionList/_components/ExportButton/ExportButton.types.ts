import type { Transaction } from "@/src/data/domain.types";
import type { DateRange } from "@/src/lib/ranges";

export type ExportButtonProps = {
  transactions: Transaction[];
  range: DateRange;
};
