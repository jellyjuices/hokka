# Supabase

One Postgres project, no auth, reached only from the server. The browser never holds a Supabase
key: every read and write crosses a route handler under [src/app/api](../src/app/api), which uses
the service role key.

## Applying the schema

Paste [migrations/0001_init.sql](migrations/0001_init.sql) into the SQL editor, or run it with the
Supabase CLI:

```sh
supabase db push
```

It is idempotent — re-running it adds nothing and drops nothing.

## Row Level Security

RLS is enabled on every table and **no policies are defined**. That closes the tables to the anon
and authenticated roles entirely; the service role bypasses RLS, so only the route handlers can
read or write. Adding a policy would open the tables to anyone holding the public anon key.

## Keeping the project awake

The free tier pauses a project after roughly seven days of no activity. `GET /api/health` runs a
`count` against `tax_settings`. Point any weekly cron at it — a Cloudflare Worker cron trigger, a
GitHub Actions schedule, or an uptime pinger.

## No foreign keys

`transactions.document_id` and `transactions.tax_period_id` are plain columns. The client queues
writes offline and drains them in order, and a foreign key would let one rejected parent row wedge
the whole queue behind a permanent 400. The ids are derived and single-user, so referential drift
is not a real risk here.
