"use client";

import { useRef } from "react";
import { DatePicker } from "@/src/components/Calendar";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { Select } from "@/src/components/Select";
import { TileInput, TileValue } from "@/src/components/TileInput";
import { useLedger } from "@/src/context/Ledger";
import { INCOME_TAX_RATES } from "@/src/data/incomeTaxRates";
import { BiometricLock } from "./_components/BiometricLock";
import { ClaimableRates } from "./_components/ClaimableRates";
import {
  SectionNote,
  SectionTitle,
  SettingsColumn,
  SettingsSection,
  SettingsStack,
  TileMeasure,
  TileUnit,
} from "./SettingsView.styles";
import { useSettingsAutosave } from "./useSettingsAutosave";

const FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

export function SettingsView() {
  const { settings, isHydrated } = useLedger();
  const formRef = useRef<HTMLFormElement>(null);
  const { isSaving, schedule, flush } = useSettingsAutosave(formRef);

  return (
    <Grid>
      <GridItem>
        <PageHeader title="Settings" icon="settings" description={isSaving ? "Saving…" : "Saved"} />
      </GridItem>
      <GridItem span={8} spanTablet={12}>
        <SettingsColumn>
          <SettingsStack
            key={isHydrated ? "ready" : "loading"}
            ref={formRef}
            onChange={schedule}
            onBlur={flush}
            onSubmit={(event) => event.preventDefault()}
          >
            <TileInput label="HST rate" htmlFor="hstRate">
              <TileMeasure>
                <TileValue
                  id="hstRate"
                  name="hstRate"
                  type="number"
                  defaultValue={settings.hstRate}
                  aria-describedby="hstRateUnit"
                />
                <TileUnit id="hstRateUnit">percent</TileUnit>
              </TileMeasure>
            </TileInput>
            <TileInput label="Filing frequency">
              <Select
                id="filingFrequency"
                name="filingFrequency"
                label="Filing frequency"
                tone="plain"
                defaultValue={settings.filingFrequency}
                options={FREQUENCIES}
                onChange={schedule}
              />
            </TileInput>
            <TileInput
              label="Income tax reserve override (%)"
              htmlFor="incomeTaxReservePct"
              hint={`Leave blank to estimate the reserve from net income using ${INCOME_TAX_RATES.taxYear} federal and Ontario rates plus CPP.`}
            >
              <TileValue
                id="incomeTaxReservePct"
                name="incomeTaxReservePct"
                type="number"
                placeholder="Automatic"
                defaultValue={settings.incomeTaxReservePct ?? ""}
              />
            </TileInput>
            <TileInput label="Fiscal year start">
              <DatePicker
                id="fiscalYearStart"
                name="fiscalYearStart"
                tone="plain"
                display="dayMonth"
                defaultValue={settings.fiscalYearStart}
                onChange={schedule}
              />
            </TileInput>
            <SettingsSection>
              <SectionTitle>Claimable by category</SectionTitle>
              <SectionNote>
                The percentage a new expense starts at. Leave a tile blank to keep the standard
                rate, and override any single entry on the transaction itself. Changing a rate here
                leaves entries already logged untouched.
              </SectionNote>
              <ClaimableRates overrides={settings.categoryClaimablePct} />
            </SettingsSection>
          </SettingsStack>
          <SettingsSection>
            <SectionTitle>Device lock</SectionTitle>
            <SectionNote>
              Kept on this device only, never synced. Turning it on registers this device&rsquo;s
              own fingerprint or face check with the browser.
            </SectionNote>
            <BiometricLock />
          </SettingsSection>
        </SettingsColumn>
      </GridItem>
    </Grid>
  );
}
