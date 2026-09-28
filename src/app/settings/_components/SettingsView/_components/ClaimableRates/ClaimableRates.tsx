"use client";

import { Icon } from "@/src/components/Icon";
import { Input } from "@/src/components/Input";
import { categoriesFor } from "@/src/data/categories";
import { claimableFieldName } from "../../SettingsView.patch";
import { RateGlyph, RateLabel } from "./ClaimableRates.styles";
import type { ClaimableRatesProps } from "./ClaimableRates.types";

export function ClaimableRates({ overrides }: ClaimableRatesProps) {
  return categoriesFor("expense").map(
    ({ id, label, description, color, icon, defaultClaimablePct }) => {
      const field = claimableFieldName(id);

      return (
        <Input
          key={id}
          id={field}
          name={field}
          variant="filled"
          label={
            <RateLabel>
              <RateGlyph $color={color} aria-hidden="true">
                <Icon name={icon} size={14} />
              </RateGlyph>
              {label}
            </RateLabel>
          }
          hint={description}
          align="end"
          appendValue="%"
          type="number"
          min={0}
          max={100}
          step={1}
          placeholder={String(defaultClaimablePct)}
          defaultValue={overrides[id] ?? ""}
          aria-label={`${label}, claimable percent`}
        />
      );
    },
  );
}
