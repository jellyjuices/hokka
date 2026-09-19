import type { ReactNode } from "react";
import type {
  DocumentKind,
  Filing,
  StoredDocument,
  TaxPeriod,
  TaxSettings,
  Transaction,
} from "@/src/data/domain.types";
import type { SyncStatus } from "@/src/lib/sync";

export type LedgerProviderProps = {
  children: ReactNode;
};

export type TransactionDraft = Omit<Transaction, "id" | "taxPeriodId"> & {
  id?: string;
  taxPeriodId?: string;
};

export type FilingDraft = Omit<Filing, "id"> & {
  id?: string;
};

export type LedgerDataValue = {
  transactions: Transaction[];
  filings: Filing[];
  periods: TaxPeriod[];
  documents: StoredDocument[];
  settings: TaxSettings;
  isHydrated: boolean;
};

export type LedgerActionsValue = {
  saveTransaction: (draft: TransactionDraft) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  saveFiling: (draft: FilingDraft) => Promise<Filing>;
  closePeriod: (id: string) => Promise<TaxPeriod>;
  updateSettings: (patch: Partial<TaxSettings>) => Promise<TaxSettings>;
  captureDocument: (file: File, kind: DocumentKind) => Promise<StoredDocument>;
};

export type SyncStateValue = {
  status: SyncStatus;
  isOnline: boolean;
  pendingCount: number;
  lastError: string | null;
  lastSyncedAt: number | null;
  syncNow: () => Promise<void>;
};
