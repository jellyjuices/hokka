import type { Transaction } from "@/src/data/domain.types";

function matchesQuery(transaction: Transaction, needle: string) {
  return [transaction.counterparty, transaction.category, transaction.notes].some((field) =>
    field.toLowerCase().includes(needle),
  );
}

export function searchTransactions(transactions: Transaction[], query: string) {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [];
  return transactions.filter((transaction) => matchesQuery(transaction, needle));
}
