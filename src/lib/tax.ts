import type { Filing, TaxSettings, Transaction } from "@/src/data/domain.types";
import { resolveReservePct } from "@/src/lib/incomeTax";

export type PeriodTotals = {
  incomeTotal: number;
  expenseTotal: number;
  hstCollected: number;
  itcClaimed: number;
  hstRemitted: number;
  netHstOwing: number;
  netIncome: number;
  incomeTaxSetAside: number;
  incomeTaxReservePct: number;
  isReserveOverridden: boolean;
};

export const EMPTY_TOTALS: PeriodTotals = {
  incomeTotal: 0,
  expenseTotal: 0,
  hstCollected: 0,
  itcClaimed: 0,
  hstRemitted: 0,
  netHstOwing: 0,
  netIncome: 0,
  incomeTaxSetAside: 0,
  incomeTaxReservePct: 0,
  isReserveOverridden: false,
};

function roundToCents(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function splitHstFromTotal(total: number, hstRate: number) {
  const subtotal = roundToCents(total / (1 + hstRate / 100));
  return { subtotal, hstAmount: roundToCents(total - subtotal), total, hstRate };
}

export function totalFromSubtotal(subtotal: number, hstRate: number) {
  const hstAmount = roundToCents(subtotal * (hstRate / 100));
  return { subtotal, hstAmount, total: roundToCents(subtotal + hstAmount), hstRate };
}

export function incomeTotal(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.direction === "income")
    .reduce((total, transaction) => total + transaction.total, 0);
}

export function expenseTotal(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.direction === "expense")
    .reduce((total, transaction) => total + transaction.total, 0);
}

export function hstCollected(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.direction === "income")
    .reduce((total, transaction) => total + transaction.hstAmount, 0);
}

export function itcClaimed(transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.direction === "expense")
    .reduce(
      (total, transaction) => total + transaction.hstAmount * (transaction.claimablePct / 100),
      0,
    );
}

export function hstRemitted(filings: Filing[]) {
  return filings
    .filter((filing) => filing.filingType === "hst")
    .reduce((total, filing) => total + filing.amountFiled, 0);
}

export function netIncome(transactions: Transaction[]) {
  return transactions.reduce((total, transaction) => {
    if (transaction.direction === "income") return total + transaction.subtotal;
    return total - transaction.subtotal * (transaction.claimablePct / 100);
  }, 0);
}

export function incomeTaxReserve(netIncomeToDate: number, overridePct: number | null) {
  const reservePct = resolveReservePct(netIncomeToDate, overridePct);
  return {
    reservePct,
    setAside: Math.max(netIncomeToDate, 0) * (reservePct / 100),
    isOverridden: overridePct !== null,
  };
}

export function calculatePeriodTotals(
  transactions: Transaction[],
  filings: Filing[],
  settings: TaxSettings,
): PeriodTotals {
  const collected = hstCollected(transactions);
  const itcs = itcClaimed(transactions);
  const remitted = hstRemitted(filings);
  const incomeToDate = netIncome(transactions);
  const reserve = incomeTaxReserve(incomeToDate, settings.incomeTaxReservePct);

  return {
    incomeTotal: incomeTotal(transactions),
    expenseTotal: expenseTotal(transactions),
    hstCollected: collected,
    itcClaimed: itcs,
    hstRemitted: remitted,
    netHstOwing: collected - itcs - remitted,
    netIncome: incomeToDate,
    incomeTaxSetAside: reserve.setAside,
    incomeTaxReservePct: reserve.reservePct,
    isReserveOverridden: reserve.isOverridden,
  };
}
