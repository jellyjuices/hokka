import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { FilingLog } from "./_components/FilingLog";

export default function FilingsPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Filings"
          icon="filings"
          description="Logged remittances net out of the dashboard without deleting history."
          action={
            <LinkButton href="/filings/new" tone="accent">
              Log a filing
            </LinkButton>
          }
        />
      </GridItem>
      <GridItem>
        <FilingLog />
      </GridItem>
    </Grid>
  );
}
