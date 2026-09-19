import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let client: SupabaseClient | null = null;

function isSupabaseConfigured() {
  return SUPABASE_URL !== "" && SERVICE_ROLE_KEY !== "";
}

export function getServiceClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-hokka-client": "server" } },
    });
  }
  return client;
}
