"use client";

import { SubtotalField } from "./SubtotalCard.styles";
import type { SubtotalCardProps } from "./SubtotalCard.types";

export function SubtotalCard({ value, onChange }: SubtotalCardProps) {
  return (
    <SubtotalField
      id="subtotal"
      label="Subtotal"
      scale="lg"
      align="end"
      prependValue="$"
      isAutoWidth
      value={value}
      placeholder="0.00"
      inputMode="decimal"
      aria-label="Subtotal before tax"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
