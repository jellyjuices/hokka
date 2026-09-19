"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLedgerActions } from "@/src/context/Ledger";
import { todayIsoDate } from "@/src/lib/dates";
import { toAmount } from "@/src/lib/money";
import type { FilingFormState } from "./FilingForm.types";

export function useFilingSave() {
  const { saveFiling } = useLedgerActions();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(state: FilingFormState) {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      await saveFiling({
        taxPeriodId: state.taxPeriodId,
        filingType: state.filingType,
        filedDate: state.filedDate === "" ? todayIsoDate() : state.filedDate,
        amountFiled: toAmount(state.amountFiled),
        referenceNumber: state.referenceNumber,
        notes: state.notes,
      });
      router.push("/filings");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the filing");
      setIsSaving(false);
    }
  }

  return { isSaving, error, save };
}
