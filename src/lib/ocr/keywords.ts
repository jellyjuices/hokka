export const SUBTOTAL_LABEL = /\b(sub\s*-?\s*total|total\s*before\s*tax|net\s*(amount|total))\b/i;
export const TIP_LABEL = /\b(tip|tips|gratuity|service\s*charge)\b/i;
const TAX_LABEL =
  /\b(h\.?\s?s\.?\s?t|g\.?\s?s\.?\s?t|p\.?\s?s\.?\s?t|q\.?\s?s\.?\s?t|tvh|tvq|sales\s*tax|tax)\b/i;
export const TOTAL_LABEL =
  /\b(grand\s*total|total\s*due|amount\s*due|balance\s*due|amount\s*paid|total)\b/i;

export const NOT_A_TOTAL =
  /\b(savings|discount|items?|units?|qty|quantity|points|loyalty|rounding)\b/i;
export const PAYMENT_LABEL =
  /\b(visa|mastercard|amex|discover|debit|credit|interac|cash|change|tender|approved|auth|chip|aid|arc|account|card\s*#|ref\s*#|terminal)\b/i;
export const CONTACT_LABEL =
  /(www\.|https?:|@|\.com|\.ca\b|\btel\b|\bph\b|\bphone\b|\bfax\b|\bunit\b|\bsuite\b|\bstore\s*#|\breg\s*#|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b)/i;
export const ADDRESS_LABEL =
  /(\b(street|st|ave|avenue|road|rd|blvd|boulevard|drive|dr|hwy|highway|ontario)\b\.?|[a-z]\d[a-z]\s?\d[a-z]\d)/i;
const REGISTRATION_LABEL = /\b(gst|hst)\s*(\/\s*(qst|pst))?\s*(no|nbr|number|#|reg)/i;

export function hasTaxLabel(line: string) {
  return TAX_LABEL.test(line) && !REGISTRATION_LABEL.test(line);
}
