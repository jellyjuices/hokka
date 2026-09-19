"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/src/components/Button";
import { DatePicker } from "@/src/components/Calendar";
import { Card } from "@/src/components/Card";
import { Field, TextInput } from "@/src/components/Field";
import { Select } from "@/src/components/Select";
import { useLedger, useLedgerActions } from "@/src/context/Ledger";
import type { FilingType } from "@/src/data/domain.types";
import { todayIsoDate } from "@/src/lib/dates";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import { FilingActions, FilingNotice } from "./FilingForm.styles";
import type { FilingFormProps } from "./FilingForm.types";

const FILING_TYPES = [
  { value: "hst", label: "HST remittance" },
  { value: "income_tax", label: "Income tax instalment" },
];

export function FilingForm({ defaults }: FilingFormProps) {
  const { periods, settings } = useLedger();
  const { saveFiling } = useLedgerActions();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(() => {
    const open = currentPeriod(settings.filingFrequency, todayIsoDate());
    const known = periods.some((period) => period.id === open.id) ? periods : [...periods, open];
    return known.map((period) => ({ value: period.id, label: periodLabel(period) }));
  }, [periods, settings.filingFrequency]);

  const selectedPeriod = options.some((option) => option.value === defaults.taxPeriodId)
    ? defaults.taxPeriodId
    : options[0]?.value;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const form = new FormData(event.currentTarget);
    setIsSaving(true);
    setError(null);
    try {
      await saveFiling({
        taxPeriodId: String(form.get("taxPeriodId") ?? ""),
        filingType: String(form.get("filingType") ?? "hst") as FilingType,
        filedDate: String(form.get("filedDate") ?? "") || todayIsoDate(),
        amountFiled: Number(form.get("amountFiled") ?? 0),
        referenceNumber: String(form.get("referenceNumber") ?? ""),
        notes: String(form.get("notes") ?? ""),
      });
      router.push("/filings");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the filing");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Filing">
        <Field label="Filing type" htmlFor="filingType">
          <Select
            id="filingType"
            name="filingType"
            label="Filing type"
            tone="outline"
            defaultValue={defaults.filingType ?? "hst"}
            options={FILING_TYPES}
          />
        </Field>
        <Field label="Period" htmlFor="taxPeriodId">
          <Select
            id="taxPeriodId"
            name="taxPeriodId"
            label="Period"
            tone="outline"
            placeholder="Select a period"
            defaultValue={selectedPeriod}
            options={options}
          />
        </Field>
        <Field label="Amount filed" htmlFor="amountFiled">
          <TextInput
            id="amountFiled"
            name="amountFiled"
            type="number"
            placeholder="0.00"
            defaultValue={defaults.amountFiled}
          />
        </Field>
        <Field label="Filed date" htmlFor="filedDate">
          <DatePicker id="filedDate" name="filedDate" />
        </Field>
        <Field label="Reference number" htmlFor="referenceNumber">
          <TextInput id="referenceNumber" name="referenceNumber" />
        </Field>
        {error === null ? null : <FilingNotice role="alert">{error}</FilingNotice>}
        <FilingActions>
          <LinkButton href="/filings">Cancel</LinkButton>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save filing"}
          </Button>
        </FilingActions>
      </Card>
    </form>
  );
}
