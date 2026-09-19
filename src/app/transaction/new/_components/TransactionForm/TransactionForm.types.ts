import type { TransactionDirection } from "@/src/data/domain.types";

export type TransactionItem = {
  id: string;
  name: string;
  amount: string;
};

export type TransactionFormState = {
  direction: TransactionDirection;
  title: string;
  categoryId: string;
  txnDate: string;
  counterparty: string;
  items: TransactionItem[];
  isTaxed: boolean;
  tips: string;
  claimablePct: string;
};

export type TransactionTotals = {
  itemsTotal: number;
  tipsAmount: number;
  subtotal: number;
  hstAmount: number;
  total: number;
  claimBack: number;
};

export type Attachment = {
  id: string;
  name: string;
  previewUrl: string;
  isImage: boolean;
  file: File | null;
  documentId: string | null;
};

export type AutofillTone = "reading" | "good" | "warn";

export type AutofillNotice = {
  tone: AutofillTone;
  text: string;
};
