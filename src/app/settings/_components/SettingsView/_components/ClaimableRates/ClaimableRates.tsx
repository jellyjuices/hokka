"use client";

import { Input } from "@/src/components/Input";
import { categoriesFor } from "@/src/data/categories";
import { claimableFieldName } from "../../SettingsView.patch";
import type { ClaimableRatesProps } from "./ClaimableRates.types";

export function ClaimableRates({ overrides }: ClaimableRatesProps) {
  return categoriesFor("expense").map(({ id, label, defaultClaimablePct }) => {
    const field = claimableFieldName(id);

    return (
      <Input
        key={id}
        id={field}
        name={field}
        variant="filled"
        label={label}
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
  });
}
