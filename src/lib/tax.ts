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

type TransactionSums = {
  incomeTotal: number;
  expenseTotal: number;
  hstCollected: number;
  itcClaimed: number;
  netIncome: number;
};

// Every figure below answers a different question about the same rows, so they are
// gathered in one walk rather than five filters over the same array.
function sumTransactions(transactions: Transaction[]): TransactionSums {
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

function hstRemitted(filings: Filing[]) {
  return filings
    .filter((filing) => filing.filingType === "hst")
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
  const sums = sumTransactions(transactions);
  const remitted = hstRemitted(filings);
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
