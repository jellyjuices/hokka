"use client";

import { createContext, useContext, useMemo } from "react";
import { useLedger, useLedgerActions } from "@/src/context/Ledger";
import type {
  TaxSettingsActions,
  TaxSettingsProviderProps,
  TaxSettingsValue,
} from "./TaxSettings.types";

const ValueContext = createContext<TaxSettingsValue | null>(null);
const ActionsContext = createContext<TaxSettingsActions | null>(null);

export function TaxSettingsProvider({ children }: TaxSettingsProviderProps) {
  const { settings, isHydrated } = useLedger();
  const { updateSettings } = useLedgerActions();

  const value = useMemo<TaxSettingsValue>(
    () => ({ settings, isLoading: !isHydrated }),
    [isHydrated, settings],
  );

  const actions = useMemo<TaxSettingsActions>(
    () => ({
      updateSettings: async (patch) => {
        await updateSettings(patch);
      },
    }),
    [updateSettings],
  );

  return (
    <ValueContext.Provider value={value}>
      <ActionsContext.Provider value={actions}>{children}</ActionsContext.Provider>
    </ValueContext.Provider>
  );
}

export function useTaxSettings() {
  const value = useContext(ValueContext);
  if (!value) throw new Error("useTaxSettings must be used inside TaxSettingsProvider");
  return value;
}

export function useTaxSettingsActions() {
  const actions = useContext(ActionsContext);
  if (!actions) throw new Error("useTaxSettingsActions must be used inside TaxSettingsProvider");
  return actions;
}

export function useTaxSettingsOptional() {
  return useContext(ValueContext);
}
