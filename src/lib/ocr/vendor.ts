import { ADDRESS_LABEL, CONTACT_LABEL, PAYMENT_LABEL } from "./keywords";
import { findAmounts } from "./money";
import { labelFor } from "./totals";

const HEADER_DEPTH = 8;
const STORE_NUMBER = /\b(store|shop|unit|no|nbr)?\s*#\s*\d+/gi;
const TRAILING_NUMBERS = /[\s#-]+\d{2,}$/;
const EDGE_PUNCTUATION = /^[^a-z0-9]+|[^a-z0-9)]+$/gi;

function letterShare(line: string) {
  const solid = line.replace(/\s/g, "");
  if (solid.length === 0) return 0;
  return (solid.match(/[a-z]/gi)?.length ?? 0) / solid.length;
}

function isVendorLine(line: string) {
  if (line.length < 3 || line.length > 48) return false;
  if (letterShare(line) < 0.6) return false;
  if (findAmounts(line).length > 0) return false;
  if (labelFor(line) !== null) return false;
  if (CONTACT_LABEL.test(line) || PAYMENT_LABEL.test(line)) return false;
  return !(ADDRESS_LABEL.test(line) && /\d/.test(line));
}

function titleCaseWord(word: string) {
  return word.charAt(0) + word.slice(1).toLowerCase();
}

function tidy(line: string) {
  const stripped = line
    .replace(STORE_NUMBER, "")
    .replace(TRAILING_NUMBERS, "")
    .replace(EDGE_PUNCTUATION, "")
    .replace(/\s+/g, " ")
    .trim();
  const isShouting = stripped === stripped.toUpperCase() && stripped.includes(" ");
  return isShouting ? stripped.split(" ").map(titleCaseWord).join(" ") : stripped;
}

export function extractVendor(lines: string[]) {
  for (const line of lines.slice(0, HEADER_DEPTH)) {
    if (!isVendorLine(line)) continue;
    const vendor = tidy(line);
    if (vendor.length >= 3) return vendor;
  }
  return null;
}
