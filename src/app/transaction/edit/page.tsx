import { Suspense } from "react";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { EditTransaction } from "../_components/EditTransaction";

export default function EditTransactionPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader title="Edit transaction" mobileTitle="Edit" backHref="/transactions" />
      </GridItem>
      <GridItem span={10} spanTablet={12}>
        <Suspense fallback={null}>
          <EditTransaction />
        </Suspense>
      </GridItem>
    </Grid>
  );
}
