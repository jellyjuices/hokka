// Everything this app stores is a calendar date, never an instant. Reading one off a
// `Date` in UTC hands you tomorrow all evening in Ontario, so today is read locally and
// a stored date is parsed locally.
const MEDIUM_DATE = new Intl.DateTimeFormat("en-CA", { dateStyle: "medium" });
const DAY_AND_MONTH = new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric" });
const DAY_MONTH_AND_YEAR = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function todayIsoDate() {
  return toIsoDate(new Date());
}

export function parseIsoDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (match === null) return new Date(isoDate);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatDate(isoDate: string) {
  return MEDIUM_DATE.format(parseIsoDate(isoDate));
}

// A recent-activity line reads better relative; a ledger row does not, so this sits
// beside formatDate rather than replacing it. Comparison is by calendar date rather
// than by elapsed milliseconds, so the two DST days a year still say "Yesterday".
export function friendlyDate(isoDate: string, today = todayIsoDate()) {
  if (isoDate === today) return "Today";

  const todayDate = parseIsoDate(today);
  const yesterday = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate() - 1,
  );
  if (isoDate === toIsoDate(yesterday)) return "Yesterday";

  const date = parseIsoDate(isoDate);
  const sameYear = date.getFullYear() === todayDate.getFullYear();
  return sameYear ? DAY_AND_MONTH.format(date) : DAY_MONTH_AND_YEAR.format(date);
}
