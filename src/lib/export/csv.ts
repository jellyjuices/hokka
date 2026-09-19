import type { Transaction } from "@/src/data/domain.types";

const COLUMNS = [
  "id",
  "txn_date",
  "direction",
  "counterparty",
  "category",
  "subtotal",
  "hst_amount",
  "total",
  "claimable_pct",
  "tax_period_id",
  "document_id",
  "notes",
];

function escapeCell(value: string | number | null) {
  const text = value === null ? "" : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function toRow(transaction: Transaction) {
  return [
    transaction.id,
    transaction.txnDate,
    transaction.direction,
    transaction.counterparty,
    transaction.category,
    transaction.subtotal,
    transaction.hstAmount,
    transaction.total,
    transaction.claimablePct,
    transaction.taxPeriodId,
    transaction.documentId,
    transaction.notes,
  ]
    .map(escapeCell)
    .join(",");
}

export function transactionsToCsv(transactions: Transaction[]) {
  return [COLUMNS.join(","), ...transactions.map(toRow)].join("\n");
}
