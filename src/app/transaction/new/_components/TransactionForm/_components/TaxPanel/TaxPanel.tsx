"use client";

import { Switch } from "@/src/components/Switch";
import {
  ModifierField,
  ModifierInput,
  ModifierLabel,
  ModifierRow,
  ModifierValue,
  TaxGroup,
  TaxLabel,
  TaxRow,
} from "./TaxPanel.styles";
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
      <TaxRow>
        <TaxLabel htmlFor="isTaxed">{`Tax - ${hstRate}%`}</TaxLabel>
        <Switch
          id="isTaxed"
          checked={isTaxed}
          onCheckedChange={onTaxedChange}
          label={`Apply ${hstRate}% HST`}
        />
      </TaxRow>
      <ModifierRow>
        <ModifierField>
          <ModifierLabel>Modifiers (Tips)</ModifierLabel>
          <ModifierValue>
            <span aria-hidden="true">$</span>
            <ModifierInput
              value={tips}
              placeholder="0.00"
              inputMode="decimal"
              aria-label="Tips"
              onChange={(event) => onTipsChange(event.target.value)}
            />
          </ModifierValue>
        </ModifierField>
        <ModifierField>
          <ModifierLabel>Claimable</ModifierLabel>
          <ModifierValue>
            <ModifierInput
              value={claimablePct}
              placeholder="100"
              inputMode="numeric"
              aria-label="Claimable percent"
              onChange={(event) => onClaimableChange(event.target.value)}
            />
            <span aria-hidden="true">%</span>
          </ModifierValue>
        </ModifierField>
      </ModifierRow>
    </TaxGroup>
  );
}
