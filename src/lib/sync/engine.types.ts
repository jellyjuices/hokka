export type SyncStatus = "idle" | "syncing" | "offline" | "error";

export type SyncEvent =
  | { kind: "pushed"; count: number }
  | { kind: "offline" }
  | { kind: "online" }
  | { kind: "blocked" }
  | { kind: "failed"; message: string };

export type SyncEngineDeps = {
  onStatusChanged: (status: SyncStatus) => void;
  onErrorChanged: (message: string | null) => void;
  onSyncedAtChanged: (syncedAt: number) => void;
  onEvent: (event: SyncEvent) => void;
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
