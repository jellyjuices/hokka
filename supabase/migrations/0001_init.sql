create table if not exists public.tax_settings (
  id text primary key,
  hst_rate numeric(5, 2) not null default 13.00,
  filing_frequency text not null default 'quarterly'
    check (filing_frequency in ('monthly', 'quarterly', 'annual')),
  income_tax_reserve_pct numeric(5, 2),
  fiscal_year_start date not null,
  is_hst_registered boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.tax_periods (
  id text primary key,
  period_type text not null check (period_type in ('monthly', 'quarterly', 'annual')),
  start_date date not null,
  end_date date not null,
  status text not null default 'open' check (status in ('open', 'filed')),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.documents (
  id text primary key,
  kind text not null check (kind in ('invoice', 'receipt')),
  file_key text not null,
  uploaded_at timestamptz not null default now(),
  ocr_status text not null default 'pending'
    check (ocr_status in ('pending', 'parsed', 'needs_review')),
  raw_ocr_json jsonb,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.transactions (
  id text primary key,
  document_id text,
  direction text not null check (direction in ('income', 'expense')),
  counterparty text not null default '',
  txn_date date not null,
  subtotal numeric(12, 2) not null default 0,
  hst_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  category text not null default '',
  claimable_pct numeric(5, 2) not null default 100,
  tax_period_id text not null,
  notes text not null default '',
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.filings (
  id text primary key,
  tax_period_id text not null,
  filing_type text not null check (filing_type in ('hst', 'income_tax')),
  filed_date date not null,
  amount_filed numeric(12, 2) not null default 0,
  reference_number text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists tax_periods_updated_at_idx on public.tax_periods (updated_at);
create index if not exists documents_updated_at_idx on public.documents (updated_at);
create index if not exists transactions_updated_at_idx on public.transactions (updated_at);
create index if not exists filings_updated_at_idx on public.filings (updated_at);
create index if not exists transactions_tax_period_idx on public.transactions (tax_period_id);
create index if not exists transactions_txn_date_idx on public.transactions (txn_date);
create index if not exists filings_tax_period_idx on public.filings (tax_period_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tax_settings_touch on public.tax_settings;
create trigger tax_settings_touch before insert or update on public.tax_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists tax_periods_touch on public.tax_periods;
create trigger tax_periods_touch before insert or update on public.tax_periods
  for each row execute function public.touch_updated_at();

drop trigger if exists documents_touch on public.documents;
create trigger documents_touch before insert or update on public.documents
  for each row execute function public.touch_updated_at();

drop trigger if exists transactions_touch on public.transactions;
create trigger transactions_touch before insert or update on public.transactions
  for each row execute function public.touch_updated_at();

drop trigger if exists filings_touch on public.filings;
create trigger filings_touch before insert or update on public.filings
  for each row execute function public.touch_updated_at();

alter table public.tax_settings enable row level security;
alter table public.tax_periods enable row level security;
alter table public.documents enable row level security;
alter table public.transactions enable row level security;
alter table public.filings enable row level security;

insert into public.tax_settings (id, hst_rate, filing_frequency, fiscal_year_start)
values ('default', 13.00, 'quarterly', date_trunc('year', now())::date)
on conflict (id) do nothing;
