import { getServiceClient } from "@/src/lib/supabase";

export const TABLES = {
  transactions: "transactions",
  filings: "filings",
  periods: "tax_periods",
  documents: "documents",
  settings: "tax_settings",
} as const;

const PAGE_SIZE = 1000;

type SyncedKey = { id: string; updated_at: string };

type Cursor = { updatedAt: string; id: string };

// The cursor carries the id as well as the timestamp. A whole page of rows written in the
// same millisecond would otherwise leave a timestamp-only cursor pointing at itself, and
// every row sharing that timestamp past the page would never be fetched.
function pageAfter(cursor: Cursor) {
  return [
    `updated_at.gt."${cursor.updatedAt}"`,
    `and(updated_at.eq."${cursor.updatedAt}",id.gt."${cursor.id}")`,
  ].join(",");
}

export async function fetchSince<Row extends SyncedKey>(
  table: string,
  since: string | null,
): Promise<Row[]> {
  const client = getServiceClient();
  const rows: Row[] = [];
  let cursor: Cursor | null = null;

  for (;;) {
    let query = client
      .from(table)
      .select("*")
      .order("updated_at", { ascending: true })
      .order("id", { ascending: true })
      .limit(PAGE_SIZE);
    if (cursor) query = query.or(pageAfter(cursor));
    else if (since) query = query.gt("updated_at", since);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const page = (data ?? []) as Row[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;

    const last = page[page.length - 1];
    cursor = { updatedAt: last.updated_at, id: last.id };
  }
}

export async function fetchLiveRowsBy<Row extends SyncedKey>(
  table: string,
  column: string,
  value: string,
): Promise<Row[]> {
  const client = getServiceClient();
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq(column, value)
    .is("deleted_at", null)
    .order("updated_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

export async function upsertRow<Row>(table: string, row: object): Promise<Row> {
  const client = getServiceClient();
  const { data, error } = await client
    .from(table)
    .upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Row;
}

export async function softDeleteRow(table: string, id: string): Promise<void> {
  const client = getServiceClient();
  const now = new Date().toISOString();
  const { error } = await client
    .from(table)
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchRowById<Row>(table: string, id: string): Promise<Row | null> {
  const client = getServiceClient();
  const { data, error } = await client.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Row) ?? null;
}

export async function pingDatabase(): Promise<number> {
  const client = getServiceClient();
  const { count, error } = await client
    .from(TABLES.settings)
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}
