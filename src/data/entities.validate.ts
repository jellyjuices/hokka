import type {
  CategoryClaimablePct,
  DocumentKind,
  FilingFrequency,
  FilingType,
  OcrStatus,
  PeriodStatus,
  TransactionDirection,
} from "./domain.types";
import type { EntityName, EntityRecord } from "./entities";

const INVALID = Symbol("invalid");

type Check<Value> = (value: unknown) => Value | typeof INVALID;

function fields(value: unknown) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

const text: Check<string> = (value) => (typeof value === "string" ? value : INVALID);

const amount: Check<number> = (value) =>
  typeof value === "number" && Number.isFinite(value) ? value : INVALID;

const anything: Check<unknown> = (value) => value;

function choice<Value extends string>(options: readonly Value[]): Check<Value> {
  return (value) =>
    typeof value === "string" && (options as readonly string[]).includes(value)
      ? (value as Value)
      : INVALID;
}

function nullable<Value>(check: Check<Value>): Check<Value | null> {
  return (value) => (value === null ? null : check(value));
}

function listOf<Value>(check: Check<Value>): Check<Value[]> {
  return (value) => {
    if (!Array.isArray(value)) return INVALID;
    const parsed: Value[] = [];
    for (const item of value) {
      const entry = check(item);
      if (entry === INVALID) return INVALID;
      parsed.push(entry);
    }
    return parsed;
  };
}

function mapOf<Value>(check: Check<Value>): Check<Record<string, Value>> {
  return (value) => {
    const row = fields(value);
    if (row === null) return INVALID;
    const parsed: Record<string, Value> = {};
    for (const [key, item] of Object.entries(row)) {
      const entry = check(item);
      if (entry === INVALID) return INVALID;
      parsed[key] = entry;
    }
    return parsed;
  };
}

function shape<Value extends object>(checks: { [Key in keyof Value]-?: Check<Value[Key]> }) {
  const keys = Object.keys(checks) as (keyof Value)[];
  return (value: unknown) => {
    const row = fields(value);
    if (row === null) return INVALID;
    const parsed = {} as Value;
    for (const key of keys) {
      const entry = checks[key](row[key as string]);
      if (entry === INVALID) return INVALID;
      parsed[key] = entry as Value[typeof key];
    }
    return parsed;
  };
}

const DIRECTIONS: readonly TransactionDirection[] = ["income", "expense"];
const DOCUMENT_KINDS: readonly DocumentKind[] = ["invoice", "receipt"];
const OCR_STATUSES: readonly OcrStatus[] = ["pending", "parsed", "needs_review"];
const FREQUENCIES: readonly FilingFrequency[] = ["monthly", "quarterly", "annual"];
const PERIOD_STATUSES: readonly PeriodStatus[] = ["open", "filed"];
const FILING_TYPES: readonly FilingType[] = ["hst", "income_tax"];

const claimableMap: Check<CategoryClaimablePct> = mapOf(amount);

const CHECKS: { [Name in EntityName]: Check<EntityRecord[Name]> } = {
  transaction: shape({
    id: text,
    documentIds: listOf(text),
    direction: choice(DIRECTIONS),
    counterparty: text,
    txnDate: text,
    subtotal: amount,
    hstAmount: amount,
    total: amount,
    category: text,
    claimablePct: amount,
    taxPeriodId: text,
    notes: text,
  }),
  filing: shape({
    id: text,
    taxPeriodId: text,
    filingType: choice(FILING_TYPES),
    filedDate: text,
    amountFiled: amount,
    referenceNumber: text,
    notes: text,
  }),
  period: shape({
    id: text,
    periodType: choice(FREQUENCIES),
    startDate: text,
    endDate: text,
    status: choice(PERIOD_STATUSES),
  }),
  document: shape({
    id: text,
    kind: choice(DOCUMENT_KINDS),
    fileKey: text,
    uploadedAt: text,
    ocrStatus: choice(OCR_STATUSES),
    rawOcrJson: anything,
  }),
  settings: shape({
    id: text,
    hstRate: amount,
    filingFrequency: choice(FREQUENCIES),
    incomeTaxReservePct: nullable(amount),
    fiscalYearStart: text,
    isHstRegistered: (value) => (typeof value === "boolean" ? value : INVALID),
    categoryClaimablePct: claimableMap,
  }),
};

export function parseEntity<Name extends EntityName>(
  entity: Name,
  value: unknown,
): EntityRecord[Name] | null {
  const parsed = CHECKS[entity](value);
  return parsed === INVALID ? null : parsed;
}
