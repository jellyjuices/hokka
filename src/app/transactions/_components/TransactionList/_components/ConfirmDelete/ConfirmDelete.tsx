"use client";

import { Button } from "@/src/components/Button";
import { Modal } from "@/src/components/Modal";
import { ConfirmBody } from "./ConfirmDelete.styles";
import type { ConfirmDeleteProps } from "./ConfirmDelete.types";

export function ConfirmDelete({
  open,
  title,
  isDeleting,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this transaction?"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Keep it
          </Button>
          <Button variant="primary" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </>
      }
    >
      <ConfirmBody>
        {`${title} leaves the ledger and every figure that counted it. Filed periods keep their filing record.`}
      </ConfirmBody>
    </Modal>
  );
}
