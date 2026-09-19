import { DEFAULT_SETTINGS } from "../defaults";
import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "../domain.types";
import {
  documentFromRow,
  documentToRow,
  filingFromRow,
  filingToRow,
  periodFromRow,
  periodToRow,
  settingsFromRow,
  settingsToRow,
  transactionFromRow,
  transactionToRow,
} from "../remote/mappers";
import type {
  DocumentRow,
  FilingRow,
  TaxPeriodRow,
  TaxSettingsRow,
  TransactionRow,
} from "../remote/rows.types";
import type { SyncCollection, SyncPullResult } from "../remote/sync.types";
import { TABLES, fetchRowById, fetchSince, softDeleteRow, upsertRow } from "./tables";

const EPOCH = "1970-01-01T00:00:00.000Z";

type DeletableRow = { id: string; deleted_at: string | null; updated_at: string };

function splitRows<Row extends DeletableRow, Record>(
  rows: Row[],
  fromRow: (row: Row) => Record,
): SyncCollection<Record> {
  const changed: Record[] = [];
  const removedIds: string[] = [];
  for (const row of rows) {
    if (row.deleted_at) removedIds.push(row.id);
    else changed.push(fromRow(row));
  }
  return { changed, removedIds };
}

function latestTimestamp(groups: { updated_at: string }[][], fallback: string) {
  let latest = fallback;
  for (const rows of groups) {
    for (const row of rows) {
      if (row.updated_at > latest) latest = row.updated_at;
    }
  }
  return latest;
}

export async function pullSince(since: string | null): Promise<SyncPullResult> {
  const [transactions, filings, periods, documents, settings] = await Promise.all([
    fetchSince<TransactionRow>(TABLES.transactions, since),
    fetchSince<FilingRow>(TABLES.filings, since),
    fetchSince<TaxPeriodRow>(TABLES.periods, since),
    fetchSince<DocumentRow>(TABLES.documents, since),
    fetchSince<TaxSettingsRow>(TABLES.settings, since),
  ]);

  return {
    serverTime: latestTimestamp(
      [transactions, filings, periods, documents, settings],
      since ?? EPOCH,
    ),
    transactions: splitRows(transactions, transactionFromRow),
    filings: splitRows(filings, filingFromRow),
    periods: splitRows(periods, periodFromRow),
    documents: splitRows(documents, documentFromRow),
    settings: settings.length === 0 ? null : settingsFromRow(settings[settings.length - 1]),
  };
}

export async function saveTransaction(transaction: Transaction): Promise<Transaction> {
  const row = await upsertRow<TransactionRow>(TABLES.transactions, transactionToRow(transaction));
  return transactionFromRow(row);
}

export function removeTransaction(id: string) {
  return softDeleteRow(TABLES.transactions, id);
}

export async function saveFiling(filing: Filing): Promise<Filing> {
  const row = await upsertRow<FilingRow>(TABLES.filings, filingToRow(filing));
  return filingFromRow(row);
}

export async function savePeriod(period: TaxPeriod): Promise<TaxPeriod> {
  const row = await upsertRow<TaxPeriodRow>(TABLES.periods, periodToRow(period));
  return periodFromRow(row);
}

export async function saveDocument(document: StoredDocument): Promise<StoredDocument> {
  const row = await upsertRow<DocumentRow>(TABLES.documents, documentToRow(document));
  return documentFromRow(row);
}

export async function saveSettings(settings: TaxSettings): Promise<TaxSettings> {
  const row = await upsertRow<TaxSettingsRow>(TABLES.settings, settingsToRow(settings));
  return settingsFromRow(row);
}

export async function getSettings(): Promise<TaxSettings> {
  const row = await fetchRowById<TaxSettingsRow>(TABLES.settings, DEFAULT_SETTINGS.id);
  return row ? settingsFromRow(row) : DEFAULT_SETTINGS;
}

export async function getDocument(id: string): Promise<StoredDocument | null> {
  const row = await fetchRowById<DocumentRow>(TABLES.documents, id);
  return row ? documentFromRow(row) : null;
}

export async function listPeriodTransactions(taxPeriodId: string): Promise<Transaction[]> {
  const rows = await fetchSince<TransactionRow>(TABLES.transactions, null);
  return rows
    .filter((row) => row.deleted_at === null && row.tax_period_id === taxPeriodId)
    .map(transactionFromRow);
}
