"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/src/components/Button";
import { DatePicker } from "@/src/components/Calendar";
import { Card } from "@/src/components/Card";
import { Field, Select, TextInput } from "@/src/components/Field";
import { useTaxSettings, useTaxSettingsActions } from "@/src/context/TaxSettings";
import { INCOME_TAX_RATES } from "@/src/data/incomeTaxRates";
import type { FilingFrequency } from "@/src/data/domain.types";
import { readSettingsPatch } from "./SettingsForm.patch";

export function SettingsForm() {
  const { settings } = useTaxSettings();
  const { updateSettings } = useTaxSettingsActions();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    await updateSettings(readSettingsPatch(new FormData(event.currentTarget), settings));
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Tax settings">
        <Field label="HST rate (%)" htmlFor="hstRate">
          <TextInput id="hstRate" name="hstRate" type="number" defaultValue={settings.hstRate} />
        </Field>
        <Field label="Filing frequency" htmlFor="filingFrequency">
          <Select
            id="filingFrequency"
            name="filingFrequency"
            defaultValue={settings.filingFrequency as FilingFrequency}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </Select>
        </Field>
        <Field
          label="Income tax reserve override (%)"
          htmlFor="incomeTaxReservePct"
          hint={`Leave blank to estimate the reserve from net income using ${INCOME_TAX_RATES.taxYear} federal and Ontario rates plus CPP.`}
        >
          <TextInput
            id="incomeTaxReservePct"
            name="incomeTaxReservePct"
            type="number"
            placeholder="Automatic"
            defaultValue={settings.incomeTaxReservePct ?? ""}
          />
        </Field>
        <Field label="Fiscal year start" htmlFor="fiscalYearStart">
          <DatePicker
            id="fiscalYearStart"
            name="fiscalYearStart"
            defaultValue={settings.fiscalYearStart}
          />
        </Field>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save settings"}
        </Button>
      </Card>
    </form>
  );
}
