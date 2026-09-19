"use client";

import { useState } from "react";
import { useLedgerActions } from "@/src/context/Ledger";
import type { Transaction } from "@/src/data/domain.types";
import { documentFileUrl } from "@/src/data/remote";
import type { MenuItem } from "@/src/components/Menu";

export function useTransactionActions() {
  const { deleteTransaction } = useLedgerActions();
  const [pending, setPending] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openAttachment(transaction: Transaction) {
    const [documentId] = transaction.documentIds;
    if (documentId === undefined) return;
    window.open(documentFileUrl(documentId), "_blank", "noopener");
  }

  function itemsFor(transaction: Transaction): MenuItem[] {
    const items: MenuItem[] = [];
    if (transaction.documentIds.length > 0) {
      items.push({
        id: "open",
        label: transaction.documentIds.length > 1 ? "Open first attachment" : "Open attachment",
        icon: "receipt",
        onSelect: () => openAttachment(transaction),
      });
    }
    items.push({
      id: "delete",
      label: "Delete",
      icon: "trash",
      isDestructive: true,
      onSelect: () => setPending(transaction),
    });
    return items;
  }

  async function confirmDelete() {
    if (pending === null || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(pending.id);
      setPending(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    pending,
    isDeleting,
    itemsFor,
    confirmDelete,
    cancelDelete: () => setPending(null),
  };
}
