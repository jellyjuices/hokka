"use client";

import { useMemo, useRef, useState } from "react";
import { GearIcon } from "@phosphor-icons/react/dist/ssr";
import { DatePicker } from "@/src/components/Calendar";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { Select } from "@/src/components/Select";
import { Input, InputShell } from "@/src/components/Input";
import { useLedger } from "@/src/context/Ledger";
import { currentYear } from "@/src/lib/dates";
import { resolveReservePct } from "@/src/lib/incomeTax";
import { summarizeTransactions } from "@/src/lib/tax";
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
  const { settings, transactions, isHydrated } = useLedger();
  const [isReserveTouched, setIsReserveTouched] = useState(false);
  const derivedReservePct = useMemo(() => {
    const year = String(currentYear());
    const yearTransactions = transactions.filter((transaction) =>
      transaction.txnDate.startsWith(year),
    );
    return resolveReservePct(summarizeTransactions(yearTransactions).netIncome, null);
  }, [transactions]);
  const isReserveOverridden = settings.incomeTaxReservePct !== null || isReserveTouched;
  const formRef = useRef<HTMLFormElement>(null);
  const { schedule, flush } = useSettingsAutosave(formRef);

  return (
    <Grid>
      <GridItem>
        <PageHeader title="Settings" icon={GearIcon} />
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
                // An untouched field shows the estimate but posts nothing, so the rate keeps tracking income.
                name={isReserveOverridden ? "incomeTaxReservePct" : undefined}
                variant="filled"
                label={isReserveOverridden ? "Income tax reserve override" : "Income tax reserve"}
                align="end"
                appendValue="%"
                type="number"
                step="0.1"
                defaultValue={settings.incomeTaxReservePct ?? derivedReservePct.toFixed(1)}
                onChange={() => setIsReserveTouched(true)}
                aria-label="Income tax reserve, percent"
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
            <SettingsSection>
              <SectionTitle>Claimable by category</SectionTitle>
              <CardWrapper direction="column">
                <ClaimableRates overrides={settings.categoryClaimablePct} />
              </CardWrapper>
            </SettingsSection>
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
