import { LinkButton } from "@/src/components/Button";
import { CardsThreeIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { TransactionList } from "./_components/TransactionList";

export default function TransactionsPage() {
  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Transactions"
          icon={CardsThreeIcon}
          description="Every invoice and receipt you have recorded."
          action={
            <LinkButton href="/transaction/new" variant="primary" trailingIcon={PlusIcon}>
              New item
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
