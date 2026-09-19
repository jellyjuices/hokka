"use client";

import type { FormEvent } from "react";
import { DatePicker } from "@/src/components/Calendar";
import { Icon } from "@/src/components/Icon";
import { Select } from "@/src/components/Select";
import { FilingSummary } from "./_components/FilingSummary";
import { FilingTypeToggle } from "./_components/FilingTypeToggle";
import {
  AmountInput,
  AmountPrefix,
  AmountRow,
  FormNotice,
  FormRoot,
  NoteField,
  NoteInput,
  PairRow,
  SoftField,
  SoftInput,
  SubmitButton,
  SubmitRow,
} from "./FilingForm.styles";
import type { FilingFormProps } from "./FilingForm.types";
import { useFilingForm } from "./useFilingForm";
import { useFilingSave } from "./useFilingSave";

export function FilingForm({ defaults }: FilingFormProps) {
  const form = useFilingForm(defaults);
  const { isSaving, error, save } = useFilingSave();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(form.state);
  }

  return (
    <FormRoot onSubmit={handleSubmit}>
      <FilingTypeToggle value={form.state.filingType} onChange={form.setFilingType} />
      <AmountRow htmlFor="amountFiled">
        <AmountPrefix aria-hidden="true">$</AmountPrefix>
        <AmountInput
          id="amountFiled"
          value={form.state.amountFiled}
          placeholder="0.00"
          inputMode="decimal"
          aria-label="Amount filed"
          onChange={(event) => form.setAmountFiled(event.target.value)}
        />
      </AmountRow>
      <PairRow>
        <Select
          id="taxPeriodId"
          label="Period"
          tone="soft"
          placeholder="Select a period"
          value={form.state.taxPeriodId}
          options={form.options}
          onChange={form.setPeriod}
        />
        <DatePicker
          id="filedDate"
          name="filedDate"
          tone="soft"
          value={form.state.filedDate}
          onChange={form.setFiledDate}
        />
      </PairRow>
      <SoftField htmlFor="referenceNumber">
        <SoftInput
          id="referenceNumber"
          value={form.state.referenceNumber}
          placeholder="Confirmation number"
          onChange={(event) => form.setReferenceNumber(event.target.value)}
        />
        <Icon name="receipt" size={22} />
      </SoftField>
      <NoteField htmlFor="notes">
        <NoteInput
          id="notes"
          value={form.state.notes}
          placeholder="Notes..."
          onChange={(event) => form.setNotes(event.target.value)}
        />
      </NoteField>
      <FilingSummary
        amountFiled={form.amountFiled}
        outstanding={form.outstanding}
        periodTitle={form.periodTitle}
      />
      {error !== null && <FormNotice role="alert">{error}</FormNotice>}
      <SubmitRow>
        <SubmitButton type="submit" size="lg" trailingIcon="arrowRight" disabled={isSaving}>
          {isSaving ? "Saving…" : "Log filing"}
        </SubmitButton>
      </SubmitRow>
    </FormRoot>
  );
}
