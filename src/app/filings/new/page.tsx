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
        <PageHeader title="Add Filing" mobileTitle="Filing" backHref="/filings" />
      </GridItem>
      <GridItem span={10} spanTablet={12}>
        <FilingForm
          defaults={{ taxPeriodId: period, filingType: toFilingType(type), amountFiled: amount }}
        />
      </GridItem>
    </Grid>
  );
}
