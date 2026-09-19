"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, LinkButton } from "@/src/components/Button";
import { DatePicker } from "@/src/components/Calendar";
import { Card } from "@/src/components/Card";
import { Field, Select, TextInput } from "@/src/components/Field";
import { useLedgerActions } from "@/src/context/Ledger";
import { CATEGORIES, findCategory } from "@/src/data/categories";
import { readTransactionDraft } from "./TransactionForm.draft";
import * as styles from "./TransactionForm.styles";

export function TransactionForm() {
  const { saveTransaction } = useLedgerActions();
  const router = useRouter();
  const documentId = useSearchParams().get("documentId");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const claimableDefault = findCategory(category)?.defaultClaimablePct ?? 100;

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      await saveTransaction(readTransactionDraft(new FormData(event.currentTarget), documentId));
      router.push("/transactions");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the transaction");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Details">
        <styles.Grid>
          <Field label="Direction" htmlFor="direction">
            <Select id="direction" name="direction" defaultValue="expense">
              <option value="income">Income (invoice)</option>
              <option value="expense">Expense (receipt)</option>
            </Select>
          </Field>
          <Field label="Counterparty" htmlFor="counterparty">
            <TextInput id="counterparty" name="counterparty" placeholder="Vendor or client" />
          </Field>
          <Field label="Date" htmlFor="txnDate">
            <DatePicker id="txnDate" name="txnDate" />
          </Field>
          <Field label="Category" htmlFor="category">
            <Select id="category" name="category" value={category} onChange={handleCategoryChange}>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Subtotal"
            htmlFor="subtotal"
            hint="Pre-tax amount — this is what is deductible."
          >
            <TextInput id="subtotal" name="subtotal" type="number" placeholder="0.00" />
          </Field>
          <Field label="HST" htmlFor="hstAmount" hint="Claimed as an Input Tax Credit.">
            <TextInput id="hstAmount" name="hstAmount" type="number" placeholder="0.00" />
          </Field>
          <Field label="Total" htmlFor="total">
            <TextInput id="total" name="total" type="number" placeholder="0.00" />
          </Field>
          <Field label="Claimable %" htmlFor="claimablePct" hint="Meals default to 50%.">
            <TextInput
              key={category}
              id="claimablePct"
              name="claimablePct"
              type="number"
              defaultValue={claimableDefault}
            />
          </Field>
        </styles.Grid>
        {error === null ? null : <styles.Notice role="alert">{error}</styles.Notice>}
        <styles.Actions>
          <LinkButton href="/transactions">Cancel</LinkButton>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save transaction"}
          </Button>
        </styles.Actions>
      </Card>
    </form>
  );
}
