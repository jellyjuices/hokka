import type { ReactNode } from "react";
import type { TaxSettings } from "@/src/data/domain.types";

export type TaxSettingsProviderProps = {
  children: ReactNode;
};

export type TaxSettingsValue = {
  settings: TaxSettings;
  isLoading: boolean;
};

export type TaxSettingsActions = {
  updateSettings: (patch: Partial<TaxSettings>) => Promise<void>;
};
