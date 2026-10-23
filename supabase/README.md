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
`count` against `tax_settings`, and [keep-alive.yml](../.github/workflows/keep-alive.yml) calls it
every day. It reads the deployed origin from the `HOKKA_URL` repository secret, such as
`https://hokka.example.com`; without it every run fails before it reaches the app. Daily rather
than weekly, because GitHub starts a schedule hours late or skips it, and a late weekly run is
already past the seven days.

## No foreign keys

`transactions.document_id` and `transactions.tax_period_id` are plain columns. The client queues
writes offline and drains them in order, and a foreign key would let one rejected parent row wedge
the whole queue behind a permanent 400. The ids are derived and single-user, so referential drift
is not a real risk here.
