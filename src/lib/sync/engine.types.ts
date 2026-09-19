export type SyncStatus = "idle" | "syncing" | "offline" | "error";

export type SyncEngineDeps = {
  onStatusChanged: (status: SyncStatus) => void;
  onErrorChanged: (message: string | null) => void;
  onSyncedAtChanged: (syncedAt: number) => void;
};

export type SyncEngine = {
  start: () => void;
  stop: () => void;
  syncNow: () => Promise<void>;
};

export type PushResult = {
  pushed: number;
  blocked: boolean;
};
