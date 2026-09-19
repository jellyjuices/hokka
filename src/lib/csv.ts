import type { Transaction } from "@/src/data/domain.types";

export type CsvCell = string | number | null;

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
  "document_ids",
  "notes",
];

function escapeCell(value: CsvCell) {
  const text = value === null ? "" : String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows: CsvCell[][]) {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
}

function toRow(transaction: Transaction): CsvCell[] {
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
    transaction.documentIds.join(" "),
    transaction.notes,
  ];
}

export function transactionsToCsv(transactions: Transaction[]) {
  return toCsv([COLUMNS, ...transactions.map(toRow)]);
}
