export type OcrLine = {
  text: string;
  confidence: number;
};

export type OcrPage = {
  lines: OcrLine[];
  text: string;
  confidence: number;
};

export type ParsedReceiptItem = {
  name: string;
  amount: number;
};

export type ReceiptTotals = {
  subtotal: number;
  hstAmount: number;
  total: number;
  tips: number;
  isTaxed: boolean;
  isReconciled: boolean;
};

export type ParsedReceipt = {
  vendor: string;
  txnDate: string;
  subtotal: number;
  hstAmount: number;
  total: number;
  tips: number;
  items: ParsedReceiptItem[];
  itemsCoverSubtotal: boolean;
  categoryId: string | null;
  categoryConfidence: number;
  isTaxed: boolean;
  confidence: number;
};

export type ReceiptReading = {
  text: string;
  confidence: number;
  receipt: ParsedReceipt | null;
};

export type ParseReceiptOptions = {
  hstRate: number;
  today?: Date;
};

export type MoneyMatch = {
  value: number;
  start: number;
  end: number;
};
