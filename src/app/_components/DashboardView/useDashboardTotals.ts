"use client";

import { useMemo } from "react";
import { ArrowElbowDownRightIcon, PiggyBankIcon } from "@phosphor-icons/react/dist/ssr";
import type { ActivityItem } from "../ActivityList";
import type { Obligation, ObligationState } from "../ObligationCard";
import { useLedger } from "@/src/context/Ledger";
import { findCategory } from "@/src/data/categories";
import type { Filing, FilingType, Transaction } from "@/src/data/domain.types";
import { currentYear, formatDate, todayIsoDate } from "@/src/lib/dates";
import { formatCurrency } from "@/src/lib/money";
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

const FILING_TYPE_LABEL: Record<FilingType, string> = {
  hst: "HST filed",
  income_tax: "Income tax filed",
};

function toActivityItem(transaction: Transaction): ActivityItem {
  const category = findCategory(transaction.category);
  return {
    id: transaction.id,
    meta: `${formatDate(transaction.txnDate)}${category === null ? "" : ` · ${category.label}`}`,
    title: transaction.title || transaction.vendor || "Untitled entry",
    value: formatCurrency(transaction.total),
    href: `/transaction/${transaction.id}`,
  };
}

function toFilingItem(filing: Filing): ActivityItem {
  return {
    id: filing.id,
    meta: `${formatDate(filing.filedDate)}${filing.referenceNumber === "" ? "" : ` · ${filing.referenceNumber}`}`,
    title: FILING_TYPE_LABEL[filing.filingType],
    value: formatCurrency(filing.amountFiled),
    href: "/filings",
  };
}

type DatedItem = { sortDate: string; item: ActivityItem };

function byRecency(a: DatedItem, b: DatedItem) {
  return b.sortDate.localeCompare(a.sortDate);
}

function obligationState(amount: number, isFiled: boolean): ObligationState {
  if (isFiled) return "collected";
  return amount === 0 ? "collecting" : "claimable";
}

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
    amount,
    caption: seed.caption,
    icon: seed.icon,
    state,
    filingHref: state === "claimable" ? `/filings/new?${query.toString()}` : null,
  };
}

export function useDashboardTotals(year: number) {
  const { transactions, filings, settings } = useLedger();

  return useMemo(() => {
    const isCurrentYear = year === currentYear();
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
          icon: PiggyBankIcon,
          amount: yearTotals.incomeTaxSetAside,
          taxPeriodId: String(year),
          filingType: "income_tax",
          isFiled: yearFilings.some((filing) => filing.filingType === "income_tax"),
        }),
        toObligation({
          id: `hst-${period.id}`,
          label: periodTotals.netHstOwing < 0 ? "Claim HST" : "HST owed",
          caption: `This period (${periodTitle})`,
          icon: ArrowElbowDownRightIcon,
          amount: periodTotals.netHstOwing,
          taxPeriodId: period.id,
          filingType: "hst",
          isFiled: periodFilings.some((filing) => filing.filingType === "hst"),
        }),
      ],
      incomeItems: income.slice(0, RECENT_LIMIT).map(toActivityItem),
      expenseItems: expenses.slice(0, RECENT_LIMIT).map(toActivityItem),
      recentItems: [
        ...yearTransactions.map((transaction) => ({
          sortDate: transaction.txnDate,
          item: toActivityItem(transaction),
        })),
        ...yearFilings.map((filing) => ({
          sortDate: filing.filedDate,
          item: toFilingItem(filing),
        })),
      ]
        .sort(byRecency)
        .slice(0, RECENT_LIMIT)
        .map(({ item }) => item),
      filingItems: yearFilings
        .map((filing) => ({ sortDate: filing.filedDate, item: toFilingItem(filing) }))
        .sort(byRecency)
        .map(({ item }) => item),
    };
  }, [filings, settings, transactions, year]);
}
