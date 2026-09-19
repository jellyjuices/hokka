import { DEFAULT_SETTINGS } from "../defaults";
import type { StoredDocument, TaxSettings, Transaction } from "../domain.types";
import {
  documentFromRow,
  filingFromRow,
  periodFromRow,
  settingsFromRow,
  transactionFromRow,
} from "../remote/mappers";
import type {
  DocumentRow,
  FilingRow,
  TaxPeriodRow,
  TaxSettingsRow,
  TransactionRow,
} from "../remote/rows.types";
import type { SyncCollection, SyncPullResult } from "../remote/sync.types";
import { TABLES, fetchLiveRowsBy, fetchRowById, fetchSince, softDeleteRow } from "./tables";

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

export function removeTransaction(id: string) {
  return softDeleteRow(TABLES.transactions, id);
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
  const rows = await fetchLiveRowsBy<TransactionRow>(
    TABLES.transactions,
    "tax_period_id",
    taxPeriodId,
  );
  return rows.map(transactionFromRow);
}
