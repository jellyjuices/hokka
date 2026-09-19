import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "../domain.types";
import type {
  DocumentRow,
  FilingRow,
  TaxPeriodRow,
  TaxSettingsRow,
  TransactionRow,
} from "./rows.types";

export function transactionToRow(transaction: Transaction): Omit<TransactionRow, "updated_at"> {
  return {
    id: transaction.id,
    document_ids: transaction.documentIds,
    direction: transaction.direction,
    counterparty: transaction.counterparty,
    txn_date: transaction.txnDate,
    subtotal: transaction.subtotal,
    hst_amount: transaction.hstAmount,
    total: transaction.total,
    category: transaction.category,
    claimable_pct: transaction.claimablePct,
    tax_period_id: transaction.taxPeriodId,
    notes: transaction.notes,
    deleted_at: null,
  };
}

export function transactionFromRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    documentIds: row.document_ids ?? [],
    direction: row.direction,
    counterparty: row.counterparty,
    txnDate: row.txn_date,
    subtotal: Number(row.subtotal),
    hstAmount: Number(row.hst_amount),
    total: Number(row.total),
    category: row.category,
    claimablePct: Number(row.claimable_pct),
    taxPeriodId: row.tax_period_id,
    notes: row.notes ?? "",
  };
}

export function filingToRow(filing: Filing): Omit<FilingRow, "updated_at"> {
  return {
    id: filing.id,
    tax_period_id: filing.taxPeriodId,
    filing_type: filing.filingType,
    filed_date: filing.filedDate,
    amount_filed: filing.amountFiled,
    reference_number: filing.referenceNumber,
    notes: filing.notes,
    deleted_at: null,
  };
}

export function filingFromRow(row: FilingRow): Filing {
  return {
    id: row.id,
    taxPeriodId: row.tax_period_id,
    filingType: row.filing_type,
    filedDate: row.filed_date,
    amountFiled: Number(row.amount_filed),
    referenceNumber: row.reference_number ?? "",
    notes: row.notes ?? "",
  };
}

export function periodToRow(period: TaxPeriod): Omit<TaxPeriodRow, "updated_at"> {
  return {
    id: period.id,
    period_type: period.periodType,
    start_date: period.startDate,
    end_date: period.endDate,
    status: period.status,
    deleted_at: null,
  };
}

export function periodFromRow(row: TaxPeriodRow): TaxPeriod {
  return {
    id: row.id,
    periodType: row.period_type,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
  };
}

export function documentToRow(document: StoredDocument): Omit<DocumentRow, "updated_at"> {
  return {
    id: document.id,
    kind: document.kind,
    file_key: document.fileKey,
    uploaded_at: document.uploadedAt,
    ocr_status: document.ocrStatus,
    raw_ocr_json: document.rawOcrJson ?? null,
    deleted_at: null,
  };
}

export function documentFromRow(row: DocumentRow): StoredDocument {
  return {
    id: row.id,
    kind: row.kind,
    fileKey: row.file_key,
    uploadedAt: row.uploaded_at,
    ocrStatus: row.ocr_status,
    rawOcrJson: row.raw_ocr_json ?? null,
  };
}

export function settingsToRow(settings: TaxSettings): Omit<TaxSettingsRow, "updated_at"> {
  return {
    id: settings.id,
    hst_rate: settings.hstRate,
    filing_frequency: settings.filingFrequency,
    income_tax_reserve_pct: settings.incomeTaxReservePct,
    fiscal_year_start: settings.fiscalYearStart,
    is_hst_registered: settings.isHstRegistered,
    category_claimable_pct: settings.categoryClaimablePct,
  };
}

export function settingsFromRow(row: TaxSettingsRow): TaxSettings {
  return {
    id: row.id,
    hstRate: Number(row.hst_rate),
    filingFrequency: row.filing_frequency,
    incomeTaxReservePct:
      row.income_tax_reserve_pct === null ? null : Number(row.income_tax_reserve_pct),
    fiscalYearStart: row.fiscal_year_start,
    isHstRegistered: row.is_hst_registered,
    categoryClaimablePct: row.category_claimable_pct ?? {},
  };
}
