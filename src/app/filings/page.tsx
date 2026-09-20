import { LinkButton } from "@/src/components/Button";
import { InvoiceIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { FilingLog } from "./_components/FilingLog";

export default function FilingsPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Filings"
          icon={InvoiceIcon}
          description="Tax filings logged and net HST claimed."
          action={
            <LinkButton href="/filings/new" variant="primary" trailingIcon={PlusIcon}>
              Add Filing
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
