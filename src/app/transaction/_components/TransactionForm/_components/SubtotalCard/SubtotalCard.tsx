"use client";

import { AmountField } from "../AmountField";
import { SubtotalShell } from "./SubtotalCard.styles";
import type { SubtotalCardProps } from "./SubtotalCard.types";

export function SubtotalCard({ value, onChange }: SubtotalCardProps) {
  return (
    <SubtotalShell label="Subtotal">
      <AmountField
        value={value}
        label="Subtotal before tax"
        prefix="$"
        placeholder="0.00"
        onChange={onChange}
      />
    </SubtotalShell>
  );
}
