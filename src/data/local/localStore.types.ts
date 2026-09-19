import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "../domain.types";

export type LocalCollectionName = "transactions" | "filings" | "periods" | "documents";

export type LocalRecordMap = {
  transactions: Transaction;
  filings: Filing;
  periods: TaxPeriod;
  documents: StoredDocument;
};

export type LocalTables = {
  [Name in LocalCollectionName]: Record<string, LocalRecordMap[Name]>;
};

export type LocalSnapshot = {
  transactions: Transaction[];
  filings: Filing[];
  periods: TaxPeriod[];
  documents: StoredDocument[];
  settings: TaxSettings;
  isHydrated: boolean;
};

export type LocalMergeBatch = {
  [Name in LocalCollectionName]: {
    collection: Name;
    incoming: LocalRecordMap[Name][];
    removedIds: string[];
  };
}[LocalCollectionName];
