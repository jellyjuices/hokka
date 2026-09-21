@../AGENTS.md

# Workflow

DO NOT ADD SUBAGENTS UNLESS EXPLICITLY REQUESTED.

## Gates

Run all of these before reporting work done, repo-wide, even for a small change.

```sh
npm run typecheck
npm run lint
npm run format
npm run size
npm run build
```

`npm run check` bundles the first four. `npm run format` fixes what `format:check` reports.

## Codemods and checks

All dry-run by default; the `:apply` variant writes. Running twice reports nothing to do.

| Command                           | What it does                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run types:extract`           | Lifts inline type declarations into the sibling `*.types.ts`                                                 |
| `npm run components:group`        | Folds loose `Name.{tsx,styles,types}` files into a `Name/` folder with an `index.ts`                         |
| `npm run organize`                | Both of the above, reporting only                                                                            |
| `npm run oneliners`               | Lists one-line functions — passthroughs worth inlining, and the scaffold stubs still returning a placeholder |
| `npm run aliases`                 | The passthrough subset only                                                                                  |
| `npm run arrows` / `arrows:apply` | Converts arrow consts to function declarations, verifying with `tsc` after each round                        |
| `npm run format`                  | Prettier across the repo                                                                                     |
| `npm run ocr:assets`              | Copies the Tesseract and pdf.js runtimes into gitignored `public/ocr/`; also runs on install                 |

## Never run

- A dev server. No `npm run dev`, no `next dev`. The human validates the UI.
- `git add -A` or `git commit -a`. Stage by path.

## Concurrent agents

Several agents work in this worktree at once.

- Unfamiliar changed files belong to someone else. Don't mention, revert, or commit them.
- A failing gate in files you didn't touch is not your signal. Note it in one line and re-run the gate scoped to your own work.
- Never revert, rebase, stash, reset, or checkout over another agent's work. If it blocks you, say so and ask.

## Code graph first

This repo is indexed by code-review-graph, exposed as `mcp__crg-hokka__*`. Any structural question opens with a graph call, then narrows with grep and read.

| Tool                                                       | Arguments                                                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `get_impact_radius_tool`                                   | `detail_level:"minimal"`, `max_depth:1`, explicit `changed_files` — run before editing anything exported |
| `query_graph_tool`                                         | `max_results:20`, detail left at default                                                                 |
| `semantic_search_nodes_tool`                               | `detail_level:"minimal"`, `limit:5`, `kind` when known                                                   |
| `list_communities_tool` / `get_architecture_overview_tool` | `detail_level:"minimal"`                                                                                 |
| `get_minimal_context_tool`                                 | no tuning                                                                                                |

Reading a file you already have the path for is a Read, not a graph query.

## Review

Run `/hokka-review` before every commit or PR.
