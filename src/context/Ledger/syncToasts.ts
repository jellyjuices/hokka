import type { ToastInput } from "@/src/components/Toast";
import type { SyncEvent } from "@/src/lib/sync";

const SYNC_TOAST_KEY = "sync";

export function toastForSyncEvent(event: SyncEvent): ToastInput {
  switch (event.kind) {
    case "pushed":
      return {
        tone: "success",
        message: event.count === 1 ? "1 change synced" : `${event.count} changes synced`,
        key: SYNC_TOAST_KEY,
      };
    case "offline":
      return {
        tone: "info",
        message: "No connection",
        description: "Your changes are saved on this device and sync when you are back.",
        key: SYNC_TOAST_KEY,
      };
    case "online":
      return { tone: "info", message: "Back online", key: SYNC_TOAST_KEY };
    case "blocked":
      return {
        tone: "error",
        message: "Could not sync",
        description: "Some changes are still waiting. Hokka will try again shortly.",
        key: SYNC_TOAST_KEY,
      };
    case "failed":
      return {
        tone: "error",
        message: "Something went wrong",
        description: event.message,
        key: SYNC_TOAST_KEY,
      };
  }
}
