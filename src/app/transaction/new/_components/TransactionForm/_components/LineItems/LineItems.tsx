"use client";

import { CardWrapper } from "@/src/components/CardWrapper";
import { Icon } from "@/src/components/Icon";
import { TextInput } from "@/src/components/Input";
import {
  ItemAdd,
  ItemAmount,
  ItemCurrency,
  ItemLine,
  ItemList,
  ItemRemove,
  ItemRow,
  ItemSlot,
  ItemsPill,
  SubtotalPill,
} from "./LineItems.styles";
import type { LineItemsProps } from "./LineItems.types";

function isFilled(item: { name: string; amount: string }) {
  return item.name !== "" || item.amount !== "";
}

export function LineItems({ items, onAdd, onAddSubtotal, onItemChange, onRemove }: LineItemsProps) {
  if (items.length === 0) {
    return (
      <CardWrapper>
        <ItemsPill type="button" onClick={onAdd}>
          Add items
          <Icon name="list" size={22} />
        </ItemsPill>
        <SubtotalPill type="button" onClick={onAddSubtotal}>
          Add subtotal
          <Icon name="dollar" size={22} />
        </SubtotalPill>
      </CardWrapper>
    );
  }

  return (
    <ItemList>
      {items.map((item, index) => {
        const canAdd = index === items.length - 1 && isFilled(item);
        return (
          <ItemLine key={item.id}>
            <ItemRow>
              <TextInput
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
              {isFilled(item) && (
                <ItemRemove
                  type="button"
                  aria-label="Remove item"
                  onClick={() => onRemove(item.id)}
                >
                  <Icon name="close" size={16} />
                </ItemRemove>
              )}
            </ItemRow>
            <ItemSlot $open={canAdd}>
              <ItemAdd
                type="button"
                $open={canAdd}
                disabled={!canAdd}
                aria-hidden={!canAdd}
                aria-label="Add another item"
                onClick={onAdd}
              >
                <Icon name="plus" size={16} weight="bold" />
              </ItemAdd>
            </ItemSlot>
          </ItemLine>
        );
      })}
    </ItemList>
  );
}
