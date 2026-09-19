const MONTH = new Intl.DateTimeFormat("en-CA", { month: "long" });
const MONTH_AND_YEAR = new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" });
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

export function todayDate() {
  return parseIsoDate(todayIsoDate());
}

export function currentYear() {
  return Number(todayIsoDate().slice(0, 4));
}

export function parseIsoDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (match === null) return new Date(isoDate);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function isSameDay(a: Date, b: Date) {
  return toIsoDate(a) === toIsoDate(b);
}

export function formatDate(isoDate: string, today = todayIsoDate()) {
  if (isoDate === today) return "Today";

  const reference = parseIsoDate(today);
  const yesterday = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate() - 1,
  );
  if (isoDate === toIsoDate(yesterday)) return "Yesterday";

  const date = parseIsoDate(isoDate);
  const sameYear = date.getFullYear() === reference.getFullYear();
  return sameYear ? DAY_AND_MONTH.format(date) : DAY_MONTH_AND_YEAR.format(date);
}

export function formatDayAndMonth(isoDate: string) {
  return DAY_AND_MONTH.format(parseIsoDate(isoDate));
}

export function formatMonth(isoDate: string) {
  return MONTH.format(parseIsoDate(isoDate));
}

export function formatMonthAndYear(isoDate: string) {
  return MONTH_AND_YEAR.format(parseIsoDate(isoDate));
}
