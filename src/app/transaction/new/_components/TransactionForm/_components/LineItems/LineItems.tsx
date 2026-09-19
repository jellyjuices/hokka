"use client";

import { Icon } from "@/src/components/Icon";
import {
  ItemAmount,
  ItemCurrency,
  ItemList,
  ItemName,
  ItemRemove,
  ItemRow,
} from "./LineItems.styles";
import type { LineItemsProps } from "./LineItems.types";

export function LineItems({ items, onItemChange, onRemove }: LineItemsProps) {
  return (
    <ItemList>
      {items.map((item) => {
        const isFilled = item.name !== "" || item.amount !== "";
        return (
          <ItemRow key={item.id}>
            <ItemName
              value={item.name}
              placeholder="Item name..."
              aria-label="Item name"
              onChange={(event) => onItemChange(item.id, "name", event.target.value)}
            />
            <ItemCurrency aria-hidden="true">$</ItemCurrency>
            <ItemAmount
              value={item.amount}
              placeholder="0.00"
              inputMode="decimal"
              aria-label="Item amount"
              onChange={(event) => onItemChange(item.id, "amount", event.target.value)}
            />
            {isFilled && (
              <ItemRemove type="button" aria-label="Remove item" onClick={() => onRemove(item.id)}>
                <Icon name="close" size={16} />
              </ItemRemove>
            )}
          </ItemRow>
        );
      })}
    </ItemList>
  );
}
