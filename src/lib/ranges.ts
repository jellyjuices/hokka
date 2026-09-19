import { toIsoDate, todayIsoDate } from "@/src/lib/dates";

export type DateRange = { from: string; to: string };

export type RangeUnit = "month" | "quarter" | "year";

export type RangePresetId =
  "all" | "thisMonth" | "lastMonth" | "thisQuarter" | "lastQuarter" | "thisYear" | "lastYear";

export type RangePreset = {
  id: RangePresetId;
  label: string;
  unit?: RangeUnit;
  back?: number;
};

export const ALL_TIME: DateRange = { from: "", to: "" };

export const CUSTOM_RANGE = "custom";

const MONTHS_PER_UNIT: Record<RangeUnit, number> = { month: 1, quarter: 3, year: 12 };

export const RANGE_PRESETS: RangePreset[] = [
  { id: "all", label: "All time" },
  { id: "thisMonth", label: "This month", unit: "month", back: 0 },
  { id: "lastMonth", label: "Last month", unit: "month", back: 1 },
  { id: "thisQuarter", label: "This quarter", unit: "quarter", back: 0 },
  { id: "lastQuarter", label: "Last quarter", unit: "quarter", back: 1 },
  { id: "thisYear", label: "This year", unit: "year", back: 0 },
  { id: "lastYear", label: "Last year", unit: "year", back: 1 },
];

export function isRangeSet(range: DateRange) {
  return range.from !== "" || range.to !== "";
}

export function isInRange(isoDate: string, range: DateRange) {
  if (range.from !== "" && isoDate < range.from) return false;
  return range.to === "" || isoDate <= range.to;
}

export function resolveRangePreset(id: RangePresetId, today = todayIsoDate()): DateRange {
  const preset = RANGE_PRESETS.find((candidate) => candidate.id === id);
  if (preset?.unit === undefined) return ALL_TIME;

  const span = MONTHS_PER_UNIT[preset.unit];
  const year = Number(today.slice(0, 4));
  const monthIndex = Number(today.slice(5, 7)) - 1;
  const start = Math.floor(monthIndex / span) * span - (preset.back ?? 0) * span;

  return {
    from: toIsoDate(new Date(year, start, 1)),
    to: toIsoDate(new Date(year, start + span, 0)),
  };
}

export function matchRangePreset(range: DateRange, today = todayIsoDate()): RangePresetId | null {
  if (!isRangeSet(range)) return "all";

  const match = RANGE_PRESETS.find((preset) => {
    const resolved = resolveRangePreset(preset.id, today);
    return resolved.from === range.from && resolved.to === range.to;
  });

  return match?.id ?? null;
}

export function rangeLabel(range: DateRange, today = todayIsoDate()) {
  const preset = matchRangePreset(range, today);
  if (preset !== null) {
    return RANGE_PRESETS.find((candidate) => candidate.id === preset)?.label ?? "All time";
  }
  if (range.from === "") return `Up to ${range.to}`;
  if (range.to === "") return `From ${range.from}`;
  return `${range.from} to ${range.to}`;
}
