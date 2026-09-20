"use client";

import type { FormEvent } from "react";
import { ArrowRightIcon, ReceiptIcon } from "@phosphor-icons/react/dist/ssr";
import { DatePicker } from "@/src/components/Calendar";
import { Input } from "@/src/components/Input";
import { Select } from "@/src/components/Select";
import { FilingSummary } from "./_components/FilingSummary";
import { FilingTypeToggle } from "./_components/FilingTypeToggle";
import {
  FormNotice,
  FormRoot,
  NoteField,
  PairRow,
  SubmitButton,
  SubmitRow,
} from "./FilingForm.styles";
import type { FilingFormProps } from "./FilingForm.types";
import { useFilingForm } from "./useFilingForm";
import { useFilingSave } from "./useFilingSave";

export function FilingForm({ defaults }: FilingFormProps) {
  const form = useFilingForm(defaults);
  const { isSaving, error, save } = useFilingSave();
  const isIncomeTax = form.state.filingType === "income_tax";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(form.state);
  }

  return (
    <FormRoot onSubmit={handleSubmit}>
      <FilingTypeToggle value={form.state.filingType} onChange={form.setFilingType} />
      <Input
        id="amountFiled"
        variant="plain"
        scale="display"
        prependValue="$"
        value={form.state.amountFiled}
        placeholder="0.00"
        inputMode="decimal"
        aria-label="Amount filed"
        onChange={(event) => form.setAmountFiled(event.target.value)}
      />
      <PairRow>
        <Select
          id="taxPeriodId"
          label={isIncomeTax ? "Year" : "Period"}
          variant="secondary"
          placeholder={isIncomeTax ? "Select a year" : "Select a period"}
          value={form.state.taxPeriodId}
          options={form.options}
          onChange={form.setPeriod}
        />
        <DatePicker
          id="filedDate"
          name="filedDate"
          variant="secondary"
          value={form.state.filedDate}
          onChange={form.setFiledDate}
        />
      </PairRow>
      <Input
        id="referenceNumber"
        variant="filled"
        icon={ReceiptIcon}
        value={form.state.referenceNumber}
        placeholder="Confirmation number"
        onChange={(event) => form.setReferenceNumber(event.target.value)}
      />
      <NoteField
        id="notes"
        variant="filled"
        isMultiline
        value={form.state.notes}
        placeholder="Notes..."
        onChange={(event) => form.setNotes(event.target.value)}
      />
      <FilingSummary
        amountFiled={form.amountFiled}
        outstanding={form.outstanding}
        periodTitle={form.periodTitle}
      />
      {error !== null && <FormNotice role="alert">{error}</FormNotice>}
      <SubmitRow>
        <SubmitButton type="submit" size="lg" trailingIcon={ArrowRightIcon} disabled={isSaving}>
          {isSaving ? "Saving…" : "Log filing"}
        </SubmitButton>
      </SubmitRow>
    </FormRoot>
  );
}
