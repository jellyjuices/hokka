import { CATEGORIES } from "@/src/data/categories";
import type { Transaction } from "@/src/data/domain.types";
import type { CsvCell } from "@/src/lib/csv";
import { toCsv } from "@/src/lib/csv";
import { todayIsoDate } from "@/src/lib/dates";
import { roundToCents } from "@/src/lib/money";
import type { DateRange } from "@/src/lib/ranges";
import { rangeLabel } from "@/src/lib/ranges";
import { summarizeTransactions } from "@/src/lib/tax";

const COLUMNS = [
  "Date",
  "Type",
  "Vendor",
  "Category",
  "Subtotal",
  "HST",
  "Total",
  "Claimable %",
  "Claimable subtotal",
  "Claimable HST",
  "Title",
];

function categoryLabel(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId;
}

function amount(value: number) {
  return roundToCents(value).toFixed(2);
}

function claimableShare(transaction: Transaction) {
  return transaction.direction === "expense" ? transaction.claimablePct / 100 : 1;
}

function toRow(transaction: Transaction): CsvCell[] {
  const share = claimableShare(transaction);
  return [
    transaction.txnDate,
    transaction.direction === "income" ? "Income" : "Expense",
    transaction.vendor,
    categoryLabel(transaction.category),
    amount(transaction.subtotal),
    amount(transaction.hstAmount),
    amount(transaction.total),
    transaction.direction === "expense" ? transaction.claimablePct : 100,
    amount(transaction.subtotal * share),
    transaction.direction === "expense" ? amount(transaction.hstAmount * share) : amount(0),
    transaction.title,
  ];
}

function summaryRows(transactions: Transaction[]): CsvCell[][] {
  const sums = summarizeTransactions(transactions);
  return [
    ["Summary", ""],
    ["Income collected", amount(sums.incomeTotal)],
    ["Expenses paid", amount(sums.expenseTotal)],
    ["HST collected", amount(sums.hstCollected)],
    ["Input tax credits", amount(sums.itcClaimed)],
    ["Net HST before remittances", amount(sums.hstCollected - sums.itcClaimed)],
    ["Net income", amount(sums.netIncome)],
  ];
}

export function buildLedgerCsv(
  transactions: Transaction[],
  range: DateRange,
  today = todayIsoDate(),
) {
  return toCsv([
    ["Hokka transactions", ""],
    ["Range", rangeLabel(range, today)],
    ["Exported", today],
    ["Rows", transactions.length],
    [],
    COLUMNS,
    ...transactions.map(toRow),
    [],
    ...summaryRows(transactions),
  ]);
}

export function ledgerCsvFileName(range: DateRange, today = todayIsoDate()) {
  const slug = rangeLabel(range, today)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `hokka-transactions-${slug}-${today}.csv`;
}
