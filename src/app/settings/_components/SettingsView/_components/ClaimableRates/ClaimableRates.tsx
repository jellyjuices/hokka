"use client";

import { TileInput, TileValue } from "@/src/components/TileInput";
import { categoriesFor } from "@/src/data/categories";
import { TileMeasure, TileUnit } from "../../SettingsView.styles";
import { claimableFieldName } from "../../SettingsView.patch";
import type { ClaimableRatesProps } from "./ClaimableRates.types";

export function ClaimableRates({ overrides }: ClaimableRatesProps) {
  return (
    <>
      {categoriesFor("expense").map((category) => {
        const field = claimableFieldName(category.id);
        const unit = `${field}Unit`;

        return (
          <TileInput key={category.id} label={category.label} htmlFor={field}>
            <TileMeasure>
              <TileValue
                id={field}
                name={field}
                type="number"
                min={0}
                max={100}
                step={1}
                placeholder={String(category.defaultClaimablePct)}
                defaultValue={overrides[category.id] ?? ""}
                aria-describedby={unit}
              />
              <TileUnit id={unit}>percent</TileUnit>
            </TileMeasure>
          </TileInput>
        );
      })}
    </>
  );
}
