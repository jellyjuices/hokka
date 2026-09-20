"use client";

import { useRef } from "react";
import { GearIcon } from "@phosphor-icons/react/dist/ssr";
import { DatePicker } from "@/src/components/Calendar";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { Select } from "@/src/components/Select";
import { Input, InputShell } from "@/src/components/Input";
import { useLedger } from "@/src/context/Ledger";
import { BiometricLock } from "./_components/BiometricLock";
import { ClaimableRates } from "./_components/ClaimableRates";
import { CardWrapper } from "@/src/components/CardWrapper";
import {
  SectionTitle,
  SettingsColumn,
  SettingsSection,
  SettingsStack,
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
        <PageHeader title="Settings" icon={GearIcon} description={isSaving ? "Saving…" : "Saved"} />
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
            <CardWrapper direction="column">
              <Input
                id="hstRate"
                name="hstRate"
                variant="filled"
                label="HST rate"
                align="end"
                appendValue="%"
                type="number"
                defaultValue={settings.hstRate}
                aria-label="HST rate, percent"
              />
              <InputShell variant="filled" label="Filing frequency">
                <Select
                  id="filingFrequency"
                  name="filingFrequency"
                  label="Filing frequency"
                  variant="ghost"
                  defaultValue={settings.filingFrequency}
                  options={FREQUENCIES}
                  onChange={schedule}
                />
              </InputShell>
              <Input
                id="incomeTaxReservePct"
                name="incomeTaxReservePct"
                variant="filled"
                label="Income tax reserve override"
                align="end"
                appendValue="%"
                type="number"
                defaultValue={settings.incomeTaxReservePct ?? ""}
                aria-label="Income tax reserve override, percent"
              />
              <InputShell variant="filled" label="Fiscal year start">
                <DatePicker
                  id="fiscalYearStart"
                  name="fiscalYearStart"
                  variant="ghost"
                  display="dayMonth"
                  defaultValue={settings.fiscalYearStart}
                  onChange={schedule}
                />
              </InputShell>
            </CardWrapper>
            <SectionTitle>Claimable by category</SectionTitle>
            <CardWrapper direction="column">
              <ClaimableRates overrides={settings.categoryClaimablePct} />
            </CardWrapper>
          </SettingsStack>
          <SettingsSection>
            <SectionTitle>Device lock</SectionTitle>
            <BiometricLock />
          </SettingsSection>
        </SettingsColumn>
      </GridItem>
    </Grid>
  );
}
