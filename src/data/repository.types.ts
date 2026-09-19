import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "./domain.types";

export type Repository = {
  listTransactions: (taxPeriodId: string) => Promise<Transaction[]>;
  getTransaction: (id: string) => Promise<Transaction | null>;
  saveTransaction: (transaction: Transaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;

  listPeriods: () => Promise<TaxPeriod[]>;
  closePeriod: (id: string) => Promise<TaxPeriod>;

  listFilings: (taxPeriodId: string) => Promise<Filing[]>;
  saveFiling: (filing: Filing) => Promise<Filing>;

  listDocuments: () => Promise<StoredDocument[]>;
  saveDocument: (document: StoredDocument) => Promise<StoredDocument>;

  getSettings: () => Promise<TaxSettings>;
  saveSettings: (settings: TaxSettings) => Promise<TaxSettings>;
};
