"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { DatePicker } from "@/src/components/Calendar";
import { DropZone } from "@/src/components/DropZone";
import { Icon } from "@/src/components/Icon";
import { AttachmentBar } from "./_components/AttachmentBar";
import { AttachmentGallery } from "./_components/AttachmentGallery";
import { AutofillNotice } from "./_components/AutofillNotice";
import { AutofillPrompt } from "./_components/AutofillPrompt";
import { CategoryPicker } from "./_components/CategoryPicker";
import { DirectionToggle } from "./_components/DirectionToggle";
import { LineItems } from "./_components/LineItems";
import { TaxPanel } from "./_components/TaxPanel";
import { TotalSummary } from "./_components/TotalSummary";
import {
  AttachCell,
  CategoryCell,
  FormNotice,
  FormRoot,
  HeadRow,
  PairRow,
  SoftField,
  SoftInput,
  SubmitButton,
  SubmitRow,
  TitleInput,
} from "./TransactionForm.styles";
import { useAttachments } from "./useAttachments";
import { useAutofill } from "./useAutofill";
import { useSharedFiles } from "./useSharedFiles";
import { useTransactionForm } from "./useTransactionForm";
import { useTransactionSave } from "./useTransactionSave";

export function TransactionForm() {
  const params = useSearchParams();
  const form = useTransactionForm();
  const autofill = useAutofill(form);
  const { attachments, add, remove } = useAttachments(params.get("documentId"), autofill.offer);
  useSharedFiles(params.get("shared") !== null, add);
  const { isSaving, error, save } = useTransactionSave();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  function handleRemove(attachmentId: string) {
    remove(attachmentId);
    autofill.forget(attachmentId);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(form.state, form.totals, attachments, autofill.readingFor);
  }

  return (
    <FormRoot onSubmit={handleSubmit}>
      <DropZone onFiles={add} label="Drop to attach a receipt" />
      <DirectionToggle value={form.state.direction} onChange={form.setDirection} />
      {autofill.notice !== null && <AutofillNotice notice={autofill.notice} />}
      <HeadRow>
        <TitleInput
          value={form.state.title}
          placeholder="Untitled..."
          aria-label="Transaction name"
          onChange={(event) => form.setTitle(event.target.value)}
        />
        <CategoryCell>
          <CategoryPicker
            value={form.state.categoryId}
            categories={form.categories}
            onChange={form.setCategory}
          />
        </CategoryCell>
        <AttachCell>
          <AttachmentBar
            attachments={attachments}
            onFilesChosen={add}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        </AttachCell>
      </HeadRow>
      <PairRow>
        <DatePicker
          id="txnDate"
          name="txnDate"
          tone="soft"
          value={form.state.txnDate}
          onChange={form.setDate}
        />
        <SoftField htmlFor="counterparty">
          <SoftInput
            id="counterparty"
            value={form.state.counterparty}
            placeholder="Vendor"
            onChange={(event) => form.setCounterparty(event.target.value)}
          />
          <Icon name="vendor" size={22} />
        </SoftField>
      </PairRow>
      <LineItems items={form.state.items} onItemChange={form.setItem} onRemove={form.removeItem} />
      <TaxPanel
        hstRate={form.hstRate}
        isTaxed={form.state.isTaxed}
        tips={form.state.tips}
        claimablePct={form.state.claimablePct}
        onTaxedChange={form.setTaxed}
        onTipsChange={form.setTips}
        onClaimableChange={form.setClaimablePct}
      />
      <TotalSummary
        direction={form.state.direction}
        total={form.totals.total}
        claimBack={form.totals.claimBack}
      />
      {error !== null && <FormNotice role="alert">{error}</FormNotice>}
      <SubmitRow>
        <SubmitButton
          type="submit"
          size="lg"
          trailingIcon="arrowRight"
          disabled={isSaving || autofill.isReading}
        >
          {isSaving ? "Saving…" : "Submit"}
        </SubmitButton>
      </SubmitRow>
      <AttachmentGallery
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        attachments={attachments}
        onFilesChosen={add}
        onRemove={handleRemove}
      />
      <AutofillPrompt
        open={autofill.isPromptOpen}
        onOpenChange={(open) => {
          if (!open) autofill.dismiss();
        }}
        onAutofill={autofill.confirm}
        onReference={autofill.dismiss}
      />
    </FormRoot>
  );
}
