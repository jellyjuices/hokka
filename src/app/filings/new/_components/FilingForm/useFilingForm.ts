"use client";

import { useMemo, useState } from "react";
import { useLedger } from "@/src/context/Ledger";
import type { Filing, FilingType, TaxSettings, Transaction } from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { sanitizeAmount, toAmount } from "@/src/lib/money";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import { calculatePeriodTotals, sumFilings } from "@/src/lib/tax";
import type { FilingDefaults, FilingFormState } from "./FilingForm.types";

function initialState(defaults: FilingDefaults, taxPeriodId: string): FilingFormState {
  return {
    filingType: defaults.filingType ?? "hst",
    taxPeriodId,
    filedDate: todayIsoDate(),
    amountFiled: defaults.amountFiled ?? "",
    referenceNumber: "",
    notes: "",
  };
}

function hstOutstanding(
  taxPeriodId: string,
  transactions: Transaction[],
  filings: Filing[],
  settings: TaxSettings,
) {
  const totals = calculatePeriodTotals(
    transactions.filter((transaction) => transaction.taxPeriodId === taxPeriodId),
    filings.filter((filing) => filing.taxPeriodId === taxPeriodId),
    settings,
  );
  return totals.netHstOwing;
}

function incomeTaxOutstanding(
  taxPeriodId: string,
  transactions: Transaction[],
  filings: Filing[],
  settings: TaxSettings,
) {
  const year = taxPeriodId.slice(0, 4);
  const yearFilings = filings.filter((filing) => filing.filedDate.startsWith(year));
  const totals = calculatePeriodTotals(
    transactions.filter((transaction) => transaction.txnDate.startsWith(year)),
    yearFilings,
    settings,
  );
  return totals.incomeTaxSetAside - sumFilings(yearFilings, "income_tax");
}

export function useFilingForm(defaults: FilingDefaults) {
  const { filings, periods, settings, transactions } = useLedger();

  const options = useMemo(() => {
    const open = currentPeriod(settings.filingFrequency, todayIsoDate());
    const known = periods.some((period) => period.id === open.id) ? periods : [...periods, open];
    return known.map((period) => ({ value: period.id, label: periodLabel(period) }));
  }, [periods, settings.filingFrequency]);

  const selectedPeriodId = options.some((option) => option.value === defaults.taxPeriodId)
    ? (defaults.taxPeriodId ?? "")
    : (options[0]?.value ?? "");

  const [state, setState] = useState<FilingFormState>(() =>
    initialState(defaults, selectedPeriodId),
  );

  const outstanding = useMemo(() => {
    const owing =
      state.filingType === "hst"
        ? hstOutstanding(state.taxPeriodId, transactions, filings, settings)
        : incomeTaxOutstanding(state.taxPeriodId, transactions, filings, settings);
    return Math.max(owing, 0);
  }, [filings, settings, state.filingType, state.taxPeriodId, transactions]);

  const periodTitle =
    options.find((option) => option.value === state.taxPeriodId)?.label ?? state.taxPeriodId;

  function patch(next: Partial<FilingFormState>) {
    setState((current) => ({ ...current, ...next }));
  }

  return {
    state,
    options,
    outstanding,
    periodTitle,
    amountFiled: toAmount(state.amountFiled),
    setFilingType: (filingType: FilingType) => patch({ filingType }),
    setPeriod: (taxPeriodId: string) => patch({ taxPeriodId }),
    setFiledDate: (filedDate: string) => patch({ filedDate }),
    setAmountFiled: (amountFiled: string) => patch({ amountFiled: sanitizeAmount(amountFiled) }),
    setReferenceNumber: (referenceNumber: string) => patch({ referenceNumber }),
    setNotes: (notes: string) => patch({ notes }),
  };
}

export type FilingFormApi = ReturnType<typeof useFilingForm>;
