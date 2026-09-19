import { Grid, GridItem } from "@/src/components/Grid";
import { PageHeader } from "@/src/components/PageHeader";
import { SearchResults } from "./_components/SearchResults";
import type { SearchPageProps } from "./page.types";

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q ?? "";

  return (
    <Grid>
      <GridItem>
        <PageHeader
          title="Search"
          icon="search"
          description={
            query === ""
              ? "Search across counterparties, categories and notes."
              : `Results for “${query}”`
          }
        />
      </GridItem>
      <GridItem>
        <SearchResults query={query} />
      </GridItem>
    </Grid>
  );
}
