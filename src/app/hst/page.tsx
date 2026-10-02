import { ArrowElbowDownRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { HstHistory } from "./_components/HstHistory";

export default function HstPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="HST owed"
          icon={ArrowElbowDownRightIcon}
          description="Net HST owing for every period, after remittances."
        />
      </GridItem>
      <GridItem>
        <HstHistory />
      </GridItem>
    </Grid>
  );
}
