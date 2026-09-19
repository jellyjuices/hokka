export type OutboxEntity = "transaction" | "filing" | "period" | "document" | "settings";

export type OutboxAction = "upsert" | "delete";

export type OutboxOp = {
  entity: OutboxEntity;
  action: OutboxAction;
  id: string;
  queuedAt: number;
  attempts: number;
  lastError: string | null;
};
