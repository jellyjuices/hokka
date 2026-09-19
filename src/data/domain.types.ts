export type TransactionDirection = "income" | "expense";
export type DocumentKind = "invoice" | "receipt";
export type OcrStatus = "pending" | "parsed" | "needs_review";
export type FilingFrequency = "monthly" | "quarterly" | "annual";
export type PeriodStatus = "open" | "filed";
export type FilingType = "hst" | "income_tax";

export type TaxSettings = {
  id: string;
  hstRate: number;
  filingFrequency: FilingFrequency;
  incomeTaxReservePct: number | null;
  fiscalYearStart: string;
  isHstRegistered: boolean;
};

export type StoredDocument = {
  id: string;
  kind: DocumentKind;
  fileKey: string;
  uploadedAt: string;
  ocrStatus: OcrStatus;
  rawOcrJson: unknown;
};

export type Transaction = {
  id: string;
  documentId: string | null;
  direction: TransactionDirection;
  counterparty: string;
  txnDate: string;
  subtotal: number;
  hstAmount: number;
  total: number;
  category: string;
  claimablePct: number;
  taxPeriodId: string;
  notes: string;
};

export type TaxPeriod = {
  id: string;
  periodType: FilingFrequency;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
};

export type Filing = {
  id: string;
  taxPeriodId: string;
  filingType: FilingType;
  filedDate: string;
  amountFiled: number;
  referenceNumber: string;
  notes: string;
};
