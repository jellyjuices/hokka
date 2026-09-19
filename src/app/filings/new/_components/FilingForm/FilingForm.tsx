"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/src/components/Button";
import { DatePicker } from "@/src/components/Calendar";
import { Card } from "@/src/components/Card";
import { Field, Select, TextInput } from "@/src/components/Field";
import { useLedger, useLedgerActions } from "@/src/context/Ledger";
import type { FilingType } from "@/src/data/domain.types";
import { currentPeriod, periodLabel } from "@/src/lib/periods";
import * as styles from "./FilingForm.styles";

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function FilingForm() {
  const { periods, settings } = useLedger();
  const { saveFiling } = useLedgerActions();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(() => {
    const open = currentPeriod(settings.filingFrequency, new Date());
    const known = periods.some((period) => period.id === open.id) ? periods : [...periods, open];
    return known.map((period) => ({ id: period.id, label: periodLabel(period) }));
  }, [periods, settings.filingFrequency]);

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
          <Select id="filingType" name="filingType" defaultValue="hst">
            <option value="hst">HST remittance</option>
            <option value="income_tax">Income tax instalment</option>
          </Select>
        </Field>
        <Field label="Period" htmlFor="taxPeriodId">
          <Select id="taxPeriodId" name="taxPeriodId">
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Amount filed" htmlFor="amountFiled">
          <TextInput id="amountFiled" name="amountFiled" type="number" placeholder="0.00" />
        </Field>
        <Field label="Filed date" htmlFor="filedDate">
          <DatePicker id="filedDate" name="filedDate" />
        </Field>
        <Field label="Reference number" htmlFor="referenceNumber">
          <TextInput id="referenceNumber" name="referenceNumber" />
        </Field>
        {error === null ? null : <styles.Notice role="alert">{error}</styles.Notice>}
        <styles.Actions>
          <LinkButton href="/filings">Cancel</LinkButton>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save filing"}
          </Button>
        </styles.Actions>
      </Card>
    </form>
  );
}
