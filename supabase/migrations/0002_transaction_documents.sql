alter table public.transactions
  add column if not exists document_ids text[] not null default '{}';

update public.transactions
  set document_ids = array[document_id]
  where document_id is not null
    and document_ids = '{}';

alter table public.transactions
  drop column if exists document_id;
