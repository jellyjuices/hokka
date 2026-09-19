import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "../domain.types";

export type SyncCollection<T> = {
  changed: T[];
  removedIds: string[];
};

export type SyncPullResult = {
  serverTime: string;
  transactions: SyncCollection<Transaction>;
  filings: SyncCollection<Filing>;
  periods: SyncCollection<TaxPeriod>;
  documents: SyncCollection<StoredDocument>;
  settings: TaxSettings | null;
};

export type UploadTicket = {
  fileKey: string;
  uploadUrl: string;
  expiresIn: number;
};
