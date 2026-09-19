import type { TransactionDirection } from "@/src/data/domain.types";

export type TotalSummaryProps = {
  direction: TransactionDirection;
  total: number;
  claimBack: number;
};
