import { Suspense } from "react";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { TransactionForm } from "./_components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader title="New transaction" mobileTitle="New" backHref="/transactions" />
      </GridItem>
      <GridItem span={8} spanTablet={12}>
        <Suspense fallback={null}>
          <TransactionForm />
        </Suspense>
      </GridItem>
    </Grid>
  );
}
