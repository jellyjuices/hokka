# Data layer

Hokka is local-first. Every screen reads an IndexedDB mirror, every write lands there first, and a
sync engine drains a queue to Supabase when the network allows it. The app is fully usable with no
connection; sync is a background concern, never something a form waits on.

```
UI  →  LedgerProvider  →  repository  →  local mirror (IndexedDB)
                                      ↘  outbox  →  sync engine  →  /api/*  →  Supabase + R2
```

## Layers

| Module                                              | Role                                                                                                                                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/lib/storage](../src/lib/storage)               | `idb.ts` is a keyval object store; `keyval.ts` wraps it and falls back to `localStorage` when IndexedDB is unavailable. Blobs need IndexedDB.                                            |
| [src/data/local](../src/data/local)                 | The mirror (`localStore.ts`), the write queue (`outbox.ts`) and the queued receipt files (`pendingFiles.ts`). All three are module-level external stores with `subscribe`/`getSnapshot`. |
| [src/data/repository.ts](../src/data/repository.ts) | The port from [repository.types.ts](../src/data/repository.types.ts). Writes the mirror, then enqueues an op. It never touches the network.                                              |
| [src/lib/sync](../src/lib/sync)                     | `push.ts` drains the outbox, `pull.ts` merges server changes, `engine.ts` decides when either runs.                                                                                      |
| [src/data/remote](../src/data/remote)               | The browser's view of the API: typed fetch wrappers plus the row mappers.                                                                                                                |
| [src/data/server](../src/data/server)               | The route handlers' view of Postgres. The only code that holds a Supabase key.                                                                                                           |
| [src/context/Ledger](../src/context/Ledger)         | Three contexts — data, actions, sync state — over the stores above.                                                                                                                      |

## Reads are reactive

`LedgerProvider` subscribes to the mirror, the outbox and connectivity through
`useSyncExternalStore`. A write publishes a new snapshot synchronously, so a saved transaction shows
up before it reaches the network, and a pulled change shows up without a refresh or a refetch.

## Writes

1. The action assigns an id and, for a transaction, derives the tax period from the date and the
   filing frequency, creating the period row if it is new.
2. The record goes into the mirror and the screen updates.
3. An op goes onto the outbox: `{ entity, action, id }`, keyed so a second edit to the same record
   replaces the first rather than queueing twice.
4. The engine drains the queue in order, 800ms after it changes, on regaining connectivity, when the
   tab becomes visible, and every five minutes.

The queue is strictly ordered and stops at the first retryable failure, so a document always reaches
R2 before the transaction that references it. A non-retryable failure (a 4xx) is recorded against
the op and dropped after five attempts rather than blocking everything behind it.

## Receipts

`captureDocument` stores the `File` in IndexedDB and writes a `documents` row to the mirror with
`ocrStatus: "pending"`. Nothing uploads yet. When the engine reaches that op it asks
`POST /api/uploads` for a presigned R2 URL, `PUT`s the bytes straight to R2, writes the row to
Postgres, then **deletes the local blob** — the device stops carrying the file the moment R2 has it.
The row itself stays in the mirror, which is what keeps the app readable offline.

Reading a receipt back goes through `GET /api/documents/[id]/file`, which 302s to a five-minute
presigned URL. R2 credentials never reach the browser.

## Pull and conflicts

`GET /api/sync?since=<cursor>` returns every row of every table whose `updated_at` is newer than the
cursor, split into `changed` and `removedIds` (rows with a `deleted_at`). The cursor is the newest
`updated_at` seen, held in `localStorage`.

The merge skips any record with a pending outbox op, so an unsent local edit is never overwritten by
the server copy it is about to replace. Beyond that it is last-write-wins, which is the right
trade-off for one user on a handful of devices.

## No auth

There is one user, so there is no sign-in, no `user_id` column and no application-level gate on the
route handlers.

RLS is on with no policies, so the public anon key cannot read or write anything — only the service
role, held by the route handlers, can. That protects the database from anyone holding a Supabase
key, but it does not protect the routes themselves: anything that can reach `/api/*` can read and
write the whole ledger. Access control belongs at the edge, in front of the deployment
(Cloudflare Access or equivalent), not in this codebase.
