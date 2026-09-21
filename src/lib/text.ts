// Postgres rejects \u0000 inside a json or jsonb value and answers "unsupported
// Unicode escape sequence", so a control character read off a scan has to be gone
// before the row is written or the document never syncs.
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function stripControlChars(value: string) {
  return value.replace(CONTROL_CHARS, "");
}

export function stripControlCharsDeep(value: unknown): unknown {
  if (typeof value === "string") return stripControlChars(value);
  if (Array.isArray(value)) return value.map(stripControlCharsDeep);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      stripControlChars(key),
      stripControlCharsDeep(entry),
    ]),
  );
}
