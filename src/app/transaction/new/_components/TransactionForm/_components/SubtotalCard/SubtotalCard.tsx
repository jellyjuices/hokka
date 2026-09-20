"use client";

import { InputSizer, SizedInput } from "@/src/components/Input";
import { SubtotalField, SubtotalLabel, SubtotalValue } from "./SubtotalCard.styles";
import type { SubtotalCardProps } from "./SubtotalCard.types";

export function SubtotalCard({ value, onChange }: SubtotalCardProps) {
  return (
    <SubtotalField htmlFor="subtotal">
      <SubtotalLabel>Subtotal</SubtotalLabel>
      <SubtotalValue>
        <span aria-hidden="true">$</span>
        <InputSizer data-value={value || "0.00"}>
          <SizedInput
            id="subtotal"
            value={value}
            placeholder="0.00"
            size={1}
            inputMode="decimal"
            aria-label="Subtotal before tax"
            onChange={(event) => onChange(event.target.value)}
          />
        </InputSizer>
      </SubtotalValue>
    </SubtotalField>
  );
}
