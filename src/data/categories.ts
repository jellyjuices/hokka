import type { TransactionDirection } from "./domain.types";

export type Category = {
  id: string;
  label: string;
  direction: TransactionDirection;
  defaultClaimablePct: number;
};

export const CATEGORIES: Category[] = [
  { id: "client_work", label: "Client work", direction: "income", defaultClaimablePct: 100 },
  {
    id: "software",
    label: "Software & subscriptions",
    direction: "expense",
    defaultClaimablePct: 100,
  },
  { id: "hardware", label: "Hardware & equipment", direction: "expense", defaultClaimablePct: 100 },
  { id: "home_office", label: "Home office", direction: "expense", defaultClaimablePct: 100 },
  { id: "travel", label: "Travel", direction: "expense", defaultClaimablePct: 100 },
  { id: "meals", label: "Meals & entertainment", direction: "expense", defaultClaimablePct: 50 },
  {
    id: "professional",
    label: "Professional fees",
    direction: "expense",
    defaultClaimablePct: 100,
  },
  {
    id: "personal",
    label: "Personal (not claimable)",
    direction: "expense",
    defaultClaimablePct: 0,
  },
];

export function findCategory(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? null;
}

export function categoriesFor(direction: TransactionDirection) {
  return CATEGORIES.filter((category) => category.direction === direction);
}
