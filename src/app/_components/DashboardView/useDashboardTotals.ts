"use client";

import { useMemo } from "react";
import type { ActivityItem } from "../ActivityList";
import { useLedger } from "@/src/context/Ledger";
import { findCategory } from "@/src/data/categories";
import type { Transaction } from "@/src/data/domain.types";
import { formatCurrency, formatDate } from "@/src/lib/format";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import { calculatePeriodTotals } from "@/src/lib/tax";

const RECENT_LIMIT = 4;

function inYear(isoDate: string, year: number) {
  return isoDate.startsWith(String(year));
}

function toActivityItem(transaction: Transaction): ActivityItem {
  const category = findCategory(transaction.category);
  return {
    id: transaction.id,
    meta: `${formatDate(transaction.txnDate)}${category === null ? "" : ` · ${category.label}`}`,
    title: transaction.counterparty === "" ? "Untitled entry" : transaction.counterparty,
    value: formatCurrency(transaction.total),
    href: "/transactions",
  };
}

export function useDashboardTotals(year: number) {
  const { transactions, filings, settings } = useLedger();

  return useMemo(() => {
    const isCurrentYear = year === new Date().getUTCFullYear();
    const reference = isCurrentYear ? new Date() : new Date(Date.UTC(year, 11, 31));
    const period = currentPeriod(settings.filingFrequency, reference);

    const yearTransactions = transactions.filter((transaction) =>
      inYear(transaction.txnDate, year),
    );
    const yearFilings = filings.filter((filing) => inYear(filing.filedDate, year));
    const periodTransactions = transactions.filter(
      (transaction) => transaction.taxPeriodId === period.id,
    );
    const periodFilings = filings.filter((filing) => filing.taxPeriodId === period.id);

    const income = yearTransactions.filter((transaction) => transaction.direction === "income");
    const expenses = yearTransactions.filter((transaction) => transaction.direction === "expense");

    return {
      period,
      periodTitle: periodLabel(period),
      yearTotals: calculatePeriodTotals(yearTransactions, yearFilings, settings),
      periodTotals: calculatePeriodTotals(periodTransactions, periodFilings, settings),
      incomeItems: income.slice(0, RECENT_LIMIT).map(toActivityItem),
      expenseItems: expenses.slice(0, RECENT_LIMIT).map(toActivityItem),
      recentItems: yearTransactions.slice(0, RECENT_LIMIT).map(toActivityItem),
    };
  }, [filings, settings, transactions, year]);
}
