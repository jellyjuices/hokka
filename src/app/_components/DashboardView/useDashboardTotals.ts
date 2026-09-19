"use client";

import { useMemo } from "react";
import type { ActivityItem } from "../ActivityList";
import type { Obligation, ObligationState } from "../ObligationCard";
import { useLedger } from "@/src/context/Ledger";
import { findCategory } from "@/src/data/categories";
import type { FilingType, Transaction } from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { formatCurrency } from "@/src/lib/money";
import { friendlyDate } from "@/src/lib/dates";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import { calculatePeriodTotals } from "@/src/lib/tax";

const RECENT_LIMIT = 4;

type ObligationSeed = {
  id: string;
  label: string;
  caption: string;
  icon: Obligation["icon"];
  amount: number;
  taxPeriodId: string;
  filingType: FilingType;
  isFiled: boolean;
};

function inYear(isoDate: string, year: number) {
  return isoDate.startsWith(String(year));
}

function toActivityItem(transaction: Transaction): ActivityItem {
  const category = findCategory(transaction.category);
  return {
    id: transaction.id,
    meta: `${friendlyDate(transaction.txnDate)}${category === null ? "" : ` · ${category.label}`}`,
    title: transaction.counterparty === "" ? "Untitled entry" : transaction.counterparty,
    value: formatCurrency(transaction.total),
    href: "/transactions",
  };
}

function obligationState(amount: number, isFiled: boolean): ObligationState {
  if (isFiled) return "collected";
  return amount === 0 ? "collecting" : "claimable";
}

// Filing happens in one place — the filing log — so an obligation links into that form
// with the period, type and amount already chosen rather than writing anything itself.
function toObligation(seed: ObligationSeed): Obligation {
  const state = obligationState(seed.amount, seed.isFiled);
  const amount = Math.abs(seed.amount);
  const query = new URLSearchParams({
    period: seed.taxPeriodId,
    type: seed.filingType,
    amount: amount.toFixed(2),
  });

  return {
    id: seed.id,
    label: seed.label,
    value: formatCurrency(amount),
    caption: seed.caption,
    icon: seed.icon,
    state,
    filingHref: state === "claimable" ? `/filings/new?${query.toString()}` : null,
  };
}

export function useDashboardTotals(year: number) {
  const { transactions, filings, settings } = useLedger();

  return useMemo(() => {
    const isCurrentYear = year === new Date().getFullYear();
    const reference = isCurrentYear ? todayIsoDate() : `${year}-12-31`;
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

    const yearTotals = calculatePeriodTotals(yearTransactions, yearFilings, settings);
    const periodTotals = calculatePeriodTotals(periodTransactions, periodFilings, settings);
    const periodTitle = periodLabel(period);

    return {
      period,
      periodTitle,
      yearTotals,
      periodTotals,
      obligations: [
        toObligation({
          id: `reserve-${year}`,
          label: "Set aside",
          caption: `For ${year} taxes`,
          icon: "reserve",
          amount: yearTotals.incomeTaxSetAside,
          taxPeriodId: period.id,
          filingType: "income_tax",
          isFiled: yearFilings.some((filing) => filing.filingType === "income_tax"),
        }),
        toObligation({
          id: `hst-${period.id}`,
          label: periodTotals.netHstOwing < 0 ? "Claim HST" : "Remit HST",
          caption: `This period (${periodTitle})`,
          icon: "claim",
          amount: periodTotals.netHstOwing,
          taxPeriodId: period.id,
          filingType: "hst",
          isFiled: periodFilings.some((filing) => filing.filingType === "hst"),
        }),
      ],
      incomeItems: income.slice(0, RECENT_LIMIT).map(toActivityItem),
      expenseItems: expenses.slice(0, RECENT_LIMIT).map(toActivityItem),
      recentItems: yearTransactions.slice(0, RECENT_LIMIT).map(toActivityItem),
    };
  }, [filings, settings, transactions, year]);
}
