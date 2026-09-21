import type { Transaction, TransactionDirection } from "@/src/data/domain.types";
import type { DateRange } from "@/src/lib/ranges";
import { ALL_TIME, isInRange, isRangeSet } from "@/src/lib/ranges";

export const ANY = "";

export type TransactionFilter = {
  direction: TransactionDirection | typeof ANY;
  category: string;
  range: DateRange;
};

export const NO_FILTER: TransactionFilter = { direction: ANY, category: ANY, range: ALL_TIME };

export function isFiltered(filter: TransactionFilter) {
  return filter.direction !== ANY || filter.category !== ANY || isRangeSet(filter.range);
}

export function filterTransactions(transactions: Transaction[], filter: TransactionFilter) {
  return transactions
    .filter((transaction) => filter.direction === ANY || transaction.direction === filter.direction)
    .filter((transaction) => filter.category === ANY || transaction.category === filter.category)
    .filter((transaction) => isInRange(transaction.txnDate, filter.range))
    .sort((a, b) => b.txnDate.localeCompare(a.txnDate));
}

function matchesQuery(transaction: Transaction, needle: string) {
  return [transaction.vendor, transaction.category, transaction.title].some((field) =>
    field.toLowerCase().includes(needle),
  );
}

export function searchTransactions(transactions: Transaction[], query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [];
  return transactions.filter((transaction) => matchesQuery(transaction, needle));
}
