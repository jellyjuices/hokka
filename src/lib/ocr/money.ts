import type { MoneyMatch } from "./ocr.types";

const DIGIT_LOOKALIKES: Record<string, string> = {
  "O": "0",
  "o": "0",
  "D": "0",
  "I": "1",
  "l": "1",
  "|": "1",
};
const LOOKALIKE_PATTERN = /[OoDIl|]/g;
const DECIMAL_TAIL = /[.,][\dOoDIl|]{2}(?!\d)/;
const MONEY_PATTERN = /(-?)\$?\s?(\d{1,3}(?:,\d{3})+|\d+)[.,](\d{2})(?![\d.,])/g;

function repairToken(token: string) {
  if (!/\d/.test(token)) return token;
  if (!DECIMAL_TAIL.test(token)) return token;
  return token.replace(LOOKALIKE_PATTERN, (character) => DIGIT_LOOKALIKES[character] ?? character);
}

export function repairDigits(text: string) {
  return text.replace(/\S+/g, repairToken);
}

export function roundToCents(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function findAmounts(line: string): MoneyMatch[] {
  const repaired = repairDigits(line);
  const matches: MoneyMatch[] = [];
  for (const match of repaired.matchAll(MONEY_PATTERN)) {
    const [whole, sign, digits, cents] = match;
    const value = Number(`${sign}${digits.replace(/,/g, "")}.${cents}`);
    if (!Number.isFinite(value)) continue;
    matches.push({ value, start: match.index, end: match.index + whole.length });
  }
  return matches;
}

export function lastAmount(line: string): MoneyMatch | null {
  const matches = findAmounts(line);
  return matches.length === 0 ? null : (matches[matches.length - 1] ?? null);
}

export function isCloseEnough(left: number, right: number, tolerance = 0.02) {
  return Math.abs(left - right) <= tolerance;
}
