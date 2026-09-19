import type { Filing, StoredDocument, TaxPeriod, TaxSettings, Transaction } from "./domain.types";

export type EntityRecord = {
  transaction: Transaction;
  filing: Filing;
  period: TaxPeriod;
  document: StoredDocument;
  settings: TaxSettings;
};

export type EntityName = keyof EntityRecord;

type EntityEndpoint = {
  path: string;
  method: "POST" | "PUT";
};

// The one list of what this ledger stores. Every dispatch over an entity — the outbox
// pusher, the route handlers, the server writer, the payload checks — is a map keyed by
// EntityName, so a sixth entity fails to compile until each of them handles it.
export const ENTITIES: { [Name in EntityName]: EntityEndpoint } = {
  transaction: { path: "/transactions", method: "POST" },
  filing: { path: "/filings", method: "POST" },
  period: { path: "/periods", method: "POST" },
  document: { path: "/documents", method: "POST" },
  settings: { path: "/settings", method: "PUT" },
};
