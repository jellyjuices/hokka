"use client";

import { Switch } from "@/src/components/Switch";
import { ModifierField, ModifierRow, TaxGroup, TaxRow } from "./TaxPanel.styles";
import type { TaxPanelProps } from "./TaxPanel.types";

export function TaxPanel({
  hstRate,
  isTaxed,
  tips,
  claimablePct,
  onTaxedChange,
  onTipsChange,
  onClaimableChange,
}: TaxPanelProps) {
  return (
    <TaxGroup>
      <TaxRow variant="filled" htmlFor="isTaxed" label={`Tax - ${hstRate}%`}>
        <Switch
          id="isTaxed"
          checked={isTaxed}
          onCheckedChange={onTaxedChange}
          label={`Apply ${hstRate}% HST`}
        />
      </TaxRow>
      <ModifierRow>
        <ModifierField
          label="Modifiers (Tips)"
          align="end"
          prependValue="$"
          isAutoWidth
          value={tips}
          placeholder="0.00"
          inputMode="decimal"
          aria-label="Tips"
          onChange={(event) => onTipsChange(event.target.value)}
        />
        <ModifierField
          label="Claimable"
          align="end"
          appendValue="%"
          isAutoWidth
          value={claimablePct}
          placeholder="100"
          maxLength={3}
          inputMode="numeric"
          aria-label="Claimable percent"
          onChange={(event) => onClaimableChange(event.target.value)}
        />
      </ModifierRow>
    </TaxGroup>
  );
}
