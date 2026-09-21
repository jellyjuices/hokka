do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'transactions' and column_name = 'notes'
  ) then
    alter table public.transactions rename column notes to title;
  end if;
end $$;
