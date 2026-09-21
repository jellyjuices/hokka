"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  getLocalSnapshot,
  getOutboxServerSnapshot,
  getOutboxSnapshot,
  getServerSnapshot,
  subscribeLocalStore,
  subscribeOutbox,
} from "@/src/data/local";
import type { OutboxEntity, OutboxOp } from "@/src/data/local";
import { hydrateRepository } from "@/src/data/repository";
import {
  getConnectivityServerSnapshot,
  getConnectivitySnapshot,
  subscribeConnectivity,
} from "@/src/lib/platform/connectivity";
import { createSyncEngine, type SyncStatus } from "@/src/lib/sync";
import { useToast } from "@/src/context/Toast";
import { ledgerActions } from "./ledgerActions";
import { toastForSyncEvent } from "./syncToasts";
import type {
  LedgerActionsValue,
  LedgerDataValue,
  LedgerProviderProps,
  SyncStateValue,
} from "./Ledger.types";

const DataContext = createContext<LedgerDataValue | null>(null);
const ActionsContext = createContext<LedgerActionsValue | null>(null);
const SyncContext = createContext<SyncStateValue | null>(null);

function countByEntity(outbox: OutboxOp[]): Record<OutboxEntity, number> {
  const counts: Record<OutboxEntity, number> = {
    transaction: 0,
    filing: 0,
    period: 0,
    document: 0,
    settings: 0,
  };
  for (const op of outbox) counts[op.entity] += 1;
  return counts;
}

export function LedgerProvider({ children }: LedgerProviderProps) {
  const snapshot = useSyncExternalStore(subscribeLocalStore, getLocalSnapshot, getServerSnapshot);
  const outbox = useSyncExternalStore(subscribeOutbox, getOutboxSnapshot, getOutboxServerSnapshot);
  const isOnline = useSyncExternalStore(
    subscribeConnectivity,
    getConnectivitySnapshot,
    getConnectivityServerSnapshot,
  );

  const { showToast } = useToast();

  const [status, setStatus] = useState<SyncStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  const [engine] = useState(() =>
    createSyncEngine({
      onStatusChanged: setStatus,
      onErrorChanged: setLastError,
      onSyncedAtChanged: setLastSyncedAt,
      onEvent: (event) => showToast(toastForSyncEvent(event)),
    }),
  );

  useEffect(() => {
    let isActive = true;
    void hydrateRepository().then(() => {
      if (isActive) engine.start();
    });
    return () => {
      isActive = false;
      engine.stop();
    };
  }, [engine]);

  const data = useMemo<LedgerDataValue>(
    () => ({
      transactions: snapshot.transactions,
      filings: snapshot.filings,
      periods: snapshot.periods,
      documents: snapshot.documents,
      settings: snapshot.settings,
      isHydrated: snapshot.isHydrated,
    }),
    [snapshot],
  );

  const sync = useMemo<SyncStateValue>(
    () => ({
      status,
      isOnline,
      pendingCounts: countByEntity(outbox),
      lastError,
      lastSyncedAt,
      syncNow: engine.syncNow,
    }),
    [engine, isOnline, lastError, lastSyncedAt, outbox, status],
  );

  return (
    <DataContext.Provider value={data}>
      <ActionsContext.Provider value={ledgerActions}>
        <SyncContext.Provider value={sync}>{children}</SyncContext.Provider>
      </ActionsContext.Provider>
    </DataContext.Provider>
  );
}

export function useLedger() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useLedger must be used inside LedgerProvider");
  return value;
}

export function useLedgerActions() {
  const value = useContext(ActionsContext);
  if (!value) throw new Error("useLedgerActions must be used inside LedgerProvider");
  return value;
}

export function useSyncState() {
  const value = useContext(SyncContext);
  if (!value) throw new Error("useSyncState must be used inside LedgerProvider");
  return value;
}
