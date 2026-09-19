const MONTH_NAMES = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const ISO_DATE = /\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/;
const NUMERIC_DATE = /\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/;
const MONTH_FIRST = /\b([a-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{2,4})\b/i;
const DAY_FIRST = /\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})\.?,?\s+(\d{2,4})\b/i;

const MAX_AGE_YEARS = 10;
const FUTURE_TOLERANCE_DAYS = 2;

function monthFromName(name: string) {
  return MONTH_NAMES.indexOf(name.slice(0, 3).toLowerCase()) + 1;
}

function fullYear(year: number) {
  if (year >= 1000) return year;
  return year >= 70 ? 1900 + year : 2000 + year;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number, today: Date) {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const candidate = new Date(year, month - 1, day);
  if (candidate.getMonth() !== month - 1 || candidate.getDate() !== day) return null;
  const ahead = (candidate.getTime() - today.getTime()) / 86_400_000;
  if (ahead > FUTURE_TOLERANCE_DAYS) return null;
  if (today.getFullYear() - year > MAX_AGE_YEARS) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function fromNumeric(match: RegExpMatchArray, today: Date) {
  const first = Number(match[1]);
  const second = Number(match[2]);
  const year = fullYear(Number(match[3]));
  if (first > 12) return toIsoDate(year, second, first, today);
  if (second > 12) return toIsoDate(year, first, second, today);
  return toIsoDate(year, first, second, today) ?? toIsoDate(year, second, first, today);
}

function fromLine(line: string, today: Date) {
  const iso = line.match(ISO_DATE);
  if (iso) return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3]), today);

  const named = line.match(MONTH_FIRST);
  if (named && monthFromName(named[1]) > 0) {
    return toIsoDate(fullYear(Number(named[3])), monthFromName(named[1]), Number(named[2]), today);
  }

  const dayFirst = line.match(DAY_FIRST);
  if (dayFirst && monthFromName(dayFirst[2]) > 0) {
    return toIsoDate(
      fullYear(Number(dayFirst[3])),
      monthFromName(dayFirst[2]),
      Number(dayFirst[1]),
      today,
    );
  }

  const numeric = line.match(NUMERIC_DATE);
  return numeric ? fromNumeric(numeric, today) : null;
}

export function extractDate(lines: string[], today: Date) {
  for (const line of lines) {
    const found = fromLine(line, today);
    if (found !== null) return found;
  }
  return null;
}
