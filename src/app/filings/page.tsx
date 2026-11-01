import { LinkButton } from "@/src/components/Button";
import { ArrowElbowDownRightIcon, InvoiceIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { FilingLog } from "./_components/FilingLog";
import { HeaderActions, HstCallout } from "./_components/HstCallout";

export default function FilingsPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Filings"
          icon={InvoiceIcon}
          description="Tax filings logged and net HST claimed."
          action={
            <HeaderActions>
              <LinkButton href="/hst" variant="secondary" trailingIcon={ArrowElbowDownRightIcon}>
                HST &amp; ITCs
              </LinkButton>
              <LinkButton href="/filings/new" variant="primary" trailingIcon={PlusIcon}>
                Add Filing
              </LinkButton>
            </HeaderActions>
          }
        />
      </GridItem>
      <GridItem>
        <HstCallout />
      </GridItem>
      <GridItem>
        <FilingLog />
      </GridItem>
    </Grid>
  );
}
