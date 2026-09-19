"use client";

import { Button } from "@/src/components/Button";
import { Modal } from "@/src/components/Modal";
import { PromptBody } from "./AutofillPrompt.styles";
import type { AutofillPromptProps } from "./AutofillPrompt.types";

export function AutofillPrompt({
  open,
  onOpenChange,
  onAutofill,
  onReference,
}: AutofillPromptProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Read this receipt?"
      footer={
        <>
          <Button tone="quiet" onClick={onReference}>
            Add as reference
          </Button>
          <Button tone="accent" onClick={onAutofill}>
            Auto-fill transaction
          </Button>
        </>
      }
    >
      <PromptBody>
        This transaction already has details. Auto-filling replaces the amounts and the vendor with
        what the image says.
      </PromptBody>
    </Modal>
  );
}
