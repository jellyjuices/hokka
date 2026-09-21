import type {
  DocumentKind,
  FilingFrequency,
  FilingType,
  OcrStatus,
  PeriodStatus,
  TransactionDirection,
} from "../domain.types";

export type SyncedRow = {
  updated_at: string;
  deleted_at: string | null;
};

export type TransactionRow = SyncedRow & {
  id: string;
  document_ids: string[];
  direction: TransactionDirection;
  vendor: string;
  txn_date: string;
  subtotal: number;
  hst_amount: number;
  total: number;
  category: string;
  claimable_pct: number;
  tax_period_id: string;
  title: string;
};

export type FilingRow = SyncedRow & {
  id: string;
  tax_period_id: string;
  filing_type: FilingType;
  filed_date: string;
  amount_filed: number;
  reference_number: string;
  notes: string;
};

export type TaxPeriodRow = SyncedRow & {
  id: string;
  period_type: FilingFrequency;
  start_date: string;
  end_date: string;
  status: PeriodStatus;
};

export type DocumentRow = SyncedRow & {
  id: string;
  kind: DocumentKind;
  file_key: string;
  uploaded_at: string;
  ocr_status: OcrStatus;
  raw_ocr_json: unknown;
};

export type TaxSettingsRow = {
  id: string;
  hst_rate: number;
  filing_frequency: FilingFrequency;
  income_tax_reserve_pct: number | null;
  fiscal_year_start: string;
  is_hst_registered: boolean;
  category_claimable_pct: Record<string, number> | null;
  updated_at: string;
};
