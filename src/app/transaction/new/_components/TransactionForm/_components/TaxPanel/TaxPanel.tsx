"use client";

import { InputSizer, SizedInput } from "@/src/components/Input";
import { Switch } from "@/src/components/Switch";
import {
  ModifierField,
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
            <InputSizer data-value={tips || "0.00"}>
              <SizedInput
                value={tips}
                placeholder="0.00"
                size={1}
                inputMode="decimal"
                aria-label="Tips"
                onChange={(event) => onTipsChange(event.target.value)}
              />
            </InputSizer>
          </ModifierValue>
        </ModifierField>
        <ModifierField>
          <ModifierLabel>Claimable</ModifierLabel>
          <ModifierValue>
            <InputSizer data-value={claimablePct || "100"}>
              <SizedInput
                value={claimablePct}
                placeholder="100"
                size={1}
                inputMode="numeric"
                maxLength={3}
                aria-label="Claimable percent"
                onChange={(event) => onClaimableChange(event.target.value)}
              />
            </InputSizer>
            <span aria-hidden="true">%</span>
          </ModifierValue>
        </ModifierField>
      </ModifierRow>
    </TaxGroup>
  );
}
