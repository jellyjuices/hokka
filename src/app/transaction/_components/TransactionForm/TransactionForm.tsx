"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import { DatePicker } from "@/src/components/Calendar";
import { CardWrapper } from "@/src/components/CardWrapper";
import { DropZone } from "@/src/components/DropZone";
import { Input } from "@/src/components/Input";
import type { TransactionFormProps } from "./TransactionForm.types";
import { AttachmentBar } from "./_components/AttachmentBar";
import { AttachmentGallery } from "./_components/AttachmentGallery";
import { AutofillNotice } from "./_components/AutofillNotice";
import { AutofillPrompt } from "./_components/AutofillPrompt";
import { CategoryPicker } from "./_components/CategoryPicker";
import { DirectionToggle } from "./_components/DirectionToggle";
import { LineItems } from "./_components/LineItems";
import { SubtotalCard } from "./_components/SubtotalCard";
import { TaxPanel } from "./_components/TaxPanel";
import { TotalSummary } from "./_components/TotalSummary";
import {
  AttachCell,
  CategoryCell,
  FormNotice,
  FormRoot,
  HeadRow,
  SubmitButton,
  SubmitRow,
  TitleInput,
} from "./TransactionForm.styles";
import { useAttachments } from "./useAttachments";
import { useAutofill } from "./useAutofill";
import { useSharedFiles } from "./useSharedFiles";
import { useTransactionForm } from "./useTransactionForm";
import { useTransactionSave } from "./useTransactionSave";

export function TransactionForm({ transaction }: TransactionFormProps) {
  const params = useSearchParams();
  const form = useTransactionForm(transaction);
  const autofill = useAutofill(form);
  const { attachments, add, remove } = useAttachments(
    params.get("documentId"),
    autofill.offer,
    transaction?.documentIds,
  );
  useSharedFiles(params.get("shared") !== null, add);
  const { isSaving, error, save } = useTransactionSave();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  function handleRemove(attachmentId: string) {
    remove(attachmentId);
    autofill.forget(attachmentId);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(form.state, form.totals, attachments, autofill.readingFor, transaction);
  }

  return (
    <FormRoot onSubmit={handleSubmit}>
      <DropZone onFiles={add} label="Drop to attach a receipt" />
      <DirectionToggle value={form.state.direction} onChange={form.setDirection} />
      {autofill.notice !== null && <AutofillNotice notice={autofill.notice} />}
      <HeadRow>
        <TitleInput
          variant="plain"
          scale="display"
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
      <CardWrapper stackOnMobile>
        <DatePicker
          id="txnDate"
          name="txnDate"
          variant="secondary"
          value={form.state.txnDate}
          onChange={form.setDate}
        />
        <Input
          id="counterparty"
          variant="filled"
          icon={UserIcon}
          value={form.state.counterparty}
          placeholder="Vendor"
          onChange={(event) => form.setCounterparty(event.target.value)}
        />
      </CardWrapper>
      {form.state.subtotal === null ? (
        <LineItems
          items={form.state.items}
          onAdd={form.addItem}
          onAddSubtotal={form.addSubtotal}
          onItemChange={form.setItem}
          onRemove={form.removeItem}
        />
      ) : (
        <SubtotalCard value={form.state.subtotal} onChange={form.setSubtotal} />
      )}
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
          trailingIcon={ArrowRightIcon}
          disabled={isSaving || autofill.isReading}
        >
          {isSaving ? "Saving…" : transaction === undefined ? "Submit" : "Save changes"}
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
