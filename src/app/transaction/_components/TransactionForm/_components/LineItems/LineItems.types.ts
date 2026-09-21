import type { TransactionItem } from "../../TransactionForm.types";

export type LineItemsProps = {
  items: TransactionItem[];
  onAdd: () => void;
  onAddSubtotal: () => void;
  onItemChange: (id: string, field: "name" | "amount", value: string) => void;
  onRemove: (id: string) => void;
};
