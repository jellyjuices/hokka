import { LinkButton } from "@/src/components/Button";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { TransactionList } from "./_components/TransactionList";

export default function TransactionsPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Transactions"
          icon="transactions"
          description="Every invoice and receipt you have recorded."
          action={
            <LinkButton href="/transaction/new" tone="accent" trailingIcon="plus">
              New transaction
            </LinkButton>
          }
        />
      </GridItem>
      <GridItem>
        <TransactionList />
      </GridItem>
    </Grid>
  );
}
