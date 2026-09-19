import { Suspense } from "react";
import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { TransactionForm } from "./_components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Add transaction"
          description="Pre-tax amount and HST are tracked separately on every entry."
          action={<LinkButton href="/transactions">Cancel</LinkButton>}
        />
      </GridItem>
      <GridItem span={8} spanTablet={12}>
        <Suspense fallback={null}>
          <TransactionForm />
        </Suspense>
      </GridItem>
    </Grid>
  );
}
