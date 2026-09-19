import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import type { FilingType } from "@/src/data/domain.types";
import { FilingForm } from "./_components/FilingForm";
import type { NewFilingPageProps } from "./page.types";

const FILING_TYPES: FilingType[] = ["hst", "income_tax"];

function toFilingType(value: string | undefined) {
  return FILING_TYPES.find((filingType) => filingType === value);
}

export default async function NewFilingPage({ searchParams }: NewFilingPageProps) {
  const { period, type, amount } = await searchParams;

  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Log a filing"
          description="Period, amount, and date. Nothing is overwritten."
          action={<LinkButton href="/filings">Cancel</LinkButton>}
        />
      </GridItem>
      <GridItem span={8} spanTablet={12}>
        <FilingForm
          defaults={{ taxPeriodId: period, filingType: toFilingType(type), amountFiled: amount }}
        />
      </GridItem>
    </Grid>
  );
}
