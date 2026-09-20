import type { CategoryColor } from "@/src/lib/theme";
import type { CategoryClaimablePct, TransactionDirection } from "./domain.types";

export type Category = {
  id: string;
  label: string;
  direction: TransactionDirection;
  defaultClaimablePct: number;
  color: CategoryColor;
};

export const CATEGORIES: Category[] = [
  {
    id: "client_work",
    label: "Client work",
    direction: "income",
    defaultClaimablePct: 100,
    color: "moss",
  },
  {
    id: "software",
    label: "Software & subscriptions",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "indigo",
  },
  {
    id: "hardware",
    label: "Hardware & equipment",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "teal",
  },
  {
    id: "home_office",
    label: "Home office",
    direction: "expense",
    defaultClaimablePct: 20,
    color: "amber",
  },
  { id: "travel", label: "Travel", direction: "expense", defaultClaimablePct: 100, color: "sky" },
  {
    id: "meals",
    label: "Meals & entertainment",
    direction: "expense",
    defaultClaimablePct: 50,
    color: "plum",
  },
  {
    id: "professional",
    label: "Professional fees",
    direction: "expense",
    defaultClaimablePct: 100,
    color: "slate",
  },
];

export function findCategory(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

export function categoriesFor(direction: TransactionDirection) {
  return CATEGORIES.filter((category) => category.direction === direction);
}

export function clampClaimablePct(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function claimablePctFor(categoryId: string, overrides: CategoryClaimablePct) {
  const override = overrides[categoryId];
  if (typeof override === "number" && Number.isFinite(override)) return clampClaimablePct(override);
  return findCategory(categoryId)?.defaultClaimablePct ?? 100;
}
