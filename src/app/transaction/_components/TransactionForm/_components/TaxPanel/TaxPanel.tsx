"use client";

import { Switch } from "@/src/components/Switch";
import { AmountField } from "../AmountField";
import { ModifierField, ModifierRow, ModifierShell, TaxGroup, TaxRow } from "./TaxPanel.styles";
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
        <ModifierShell label="Modifiers (Tips)">
          <AmountField
            value={tips}
            label="Tips"
            prefix="$"
            placeholder="0.00"
            onChange={onTipsChange}
          />
        </ModifierShell>
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
