import type { ReactNode } from "react";
import type { Transaction } from "@/src/data/domain.types";

export type TransactionCardProps = {
  transaction: Transaction;
  action?: ReactNode;
};
