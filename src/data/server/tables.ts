import { getServiceClient } from "@/src/lib/supabase/server";

export const TABLES = {
  transactions: "transactions",
  filings: "filings",
  periods: "tax_periods",
  documents: "documents",
  settings: "tax_settings",
} as const;

const PAGE_SIZE = 1000;

export async function fetchSince<Row extends { updated_at: string }>(
  table: string,
  since: string | null,
): Promise<Row[]> {
  const client = getServiceClient();
  const rows: Row[] = [];
  let cursor = since;

  for (;;) {
    let query = client
      .from(table)
      .select("*")
      .order("updated_at", { ascending: true })
      .limit(PAGE_SIZE);
    if (cursor) query = query.gt("updated_at", cursor);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const page = (data ?? []) as Row[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;

    const next = page[page.length - 1].updated_at;
    if (next === cursor) break;
    cursor = next;
  }

  return rows;
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
