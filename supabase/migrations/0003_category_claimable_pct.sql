alter table public.tax_settings
  add column if not exists category_claimable_pct jsonb not null default '{}'::jsonb;
