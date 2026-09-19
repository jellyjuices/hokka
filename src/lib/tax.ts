import type { Filing, FilingType, TaxSettings, Transaction } from "@/src/data/domain.types";
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

export type TransactionSums = {
  incomeTotal: number;
  expenseTotal: number;
  hstCollected: number;
  itcClaimed: number;
  netIncome: number;
};

export function summarizeTransactions(transactions: Transaction[]): TransactionSums {
  const sums: TransactionSums = {
    incomeTotal: 0,
    expenseTotal: 0,
    hstCollected: 0,
    itcClaimed: 0,
    netIncome: 0,
  };

  for (const transaction of transactions) {
    if (transaction.direction === "income") {
      sums.incomeTotal += transaction.total;
      sums.hstCollected += transaction.hstAmount;
      sums.netIncome += transaction.subtotal;
      continue;
    }
    const claimable = transaction.claimablePct / 100;
    sums.expenseTotal += transaction.total;
    sums.itcClaimed += transaction.hstAmount * claimable;
    sums.netIncome -= transaction.subtotal * claimable;
  }

  return sums;
}

export function sumFilings(filings: Filing[], filingType: FilingType) {
  return filings
    .filter((filing) => filing.filingType === filingType)
    .reduce((total, filing) => total + filing.amountFiled, 0);
}

function incomeTaxReserve(netIncomeToDate: number, overridePct: number | null) {
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
  const sums = summarizeTransactions(transactions);
  const remitted = sumFilings(filings, "hst");
  const reserve = incomeTaxReserve(sums.netIncome, settings.incomeTaxReservePct);

  return {
    incomeTotal: sums.incomeTotal,
    expenseTotal: sums.expenseTotal,
    hstCollected: sums.hstCollected,
    itcClaimed: sums.itcClaimed,
    hstRemitted: remitted,
    netHstOwing: sums.hstCollected - sums.itcClaimed - remitted,
    netIncome: sums.netIncome,
    incomeTaxSetAside: reserve.setAside,
    incomeTaxReservePct: reserve.reservePct,
    isReserveOverridden: reserve.isOverridden,
  };
}
