import type { EntityName } from "../entities";

export type OutboxEntity = EntityName;

export type OutboxAction = "upsert" | "delete";

export type OutboxOp = {
  entity: OutboxEntity;
  action: OutboxAction;
  id: string;
  queuedAt: number;
  attempts: number;
  lastError: string | null;
};
