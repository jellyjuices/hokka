alter table public.transactions
  add column if not exists items jsonb not null default '[]'::jsonb;
