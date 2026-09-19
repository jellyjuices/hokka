import type { Transaction, TransactionDirection } from "@/src/data/domain.types";

export const ANY = "";

export type TransactionFilter = {
  direction: TransactionDirection | typeof ANY;
  category: string;
  year: string;
};

export const NO_FILTER: TransactionFilter = { direction: ANY, category: ANY, year: ANY };

export function isFiltered(filter: TransactionFilter) {
  return filter.direction !== ANY || filter.category !== ANY || filter.year !== ANY;
}

export function transactionYears(transactions: Transaction[]) {
  const years = new Set(transactions.map((transaction) => transaction.txnDate.slice(0, 4)));
  return [...years].sort().reverse();
}

export function filterTransactions(transactions: Transaction[], filter: TransactionFilter) {
  return transactions
    .filter((transaction) => filter.direction === ANY || transaction.direction === filter.direction)
    .filter((transaction) => filter.category === ANY || transaction.category === filter.category)
    .filter((transaction) => filter.year === ANY || transaction.txnDate.startsWith(filter.year))
    .sort((a, b) => b.txnDate.localeCompare(a.txnDate));
}
