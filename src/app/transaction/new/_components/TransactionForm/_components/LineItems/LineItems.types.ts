import type { TransactionItem } from "../../TransactionForm.types";

export type LineItemsProps = {
  items: TransactionItem[];
  onItemChange: (id: string, field: "name" | "amount", value: string) => void;
  onRemove: (id: string) => void;
};
