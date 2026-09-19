import { createSubscribers } from "@/src/lib/platform/subscribers";
import { readValue, writeValue } from "@/src/lib/storage/keyval";
import type { OutboxAction, OutboxEntity, OutboxOp } from "./outbox.types";

const OUTBOX_KEY = "ledger.outbox.v1";

let queue: OutboxOp[] = [];
let snapshot: OutboxOp[] = [];
let hydration: Promise<void> | null = null;
const subscribers = createSubscribers();

export const EMPTY_OUTBOX: OutboxOp[] = [];

function opKey(op: Pick<OutboxOp, "entity" | "id">) {
  return `${op.entity}:${op.id}`;
}

function publish() {
  snapshot = [...queue];
  subscribers.publish();
}

async function persist() {
  await writeValue(OUTBOX_KEY, queue);
}

export function getOutboxSnapshot() {
  return snapshot;
}

export function getOutboxServerSnapshot() {
  return EMPTY_OUTBOX;
}

export function subscribeOutbox(listener: () => void) {
  subscribers.add(listener);
  return () => {
    subscribers.remove(listener);
  };
}

export function hydrateOutbox(): Promise<void> {
  if (!hydration) {
    hydration = (async () => {
      queue = (await readValue<OutboxOp[]>(OUTBOX_KEY)) ?? [];
      publish();
    })();
  }
  return hydration;
}

export async function enqueueOp(entity: OutboxEntity, action: OutboxAction, id: string) {
  const op: OutboxOp = { entity, action, id, queuedAt: Date.now(), attempts: 0, lastError: null };
  queue = [...queue.filter((existing) => opKey(existing) !== opKey(op)), op];
  publish();
  await persist();
}

export async function removeOp(op: OutboxOp) {
  const key = opKey(op);
  const next = queue.filter((existing) => opKey(existing) !== key);
  if (next.length === queue.length) return;
  queue = next;
  publish();
  await persist();
}

export async function recordOpFailure(op: OutboxOp, message: string) {
  const key = opKey(op);
  queue = queue.map((existing) =>
    opKey(existing) === key
      ? { ...existing, attempts: existing.attempts + 1, lastError: message }
      : existing,
  );
  publish();
  await persist();
}

export function readOutbox() {
  return [...queue];
}

export function hasPendingOp(entity: OutboxEntity, id: string) {
  return queue.some((op) => op.entity === entity && op.id === id);
}
