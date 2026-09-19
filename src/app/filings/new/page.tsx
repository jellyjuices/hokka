import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { FilingForm } from "./_components/FilingForm";

export default function NewFilingPage() {
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
        <FilingForm />
      </GridItem>
    </Grid>
  );
}
