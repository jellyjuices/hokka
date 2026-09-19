---
name: hokka-review
description: Review changes in Hokka against the repo's conventions and the HST domain rules. Use before any commit or PR in this repo, or when asked to review a diff, file, or branch here.
---

# Hokka review

## 1. Resolve a target

Working changes, staged changes, branch-vs-main, or an explicit path. Ask if not given. Never default to the whole repo.

## 2. Gather context

Read each changed file in full, plus its siblings (`.styles.ts`, `.types.ts`, `index.ts`) and the relevant section of [AGENTS.md](../../../AGENTS.md).

## 3. Run the gates

`npm run typecheck`, `npm run lint`, `npm run size`. Record pass/fail as evidence.

## 4. Evaluate

| ID    | Rule                                                                               | Severity |
| ----- | ---------------------------------------------------------------------------------- | -------- |
| CMT-1 | No comments of any kind, except a `TODO` marking unimplemented scaffold            | high     |
| STR-1 | Every component is a folder with `Name.tsx`, `.styles.ts`, `.types.ts`, `index.ts` | high     |
| STR-2 | Imports go through the folder, never an inner file path                            | high     |
| STY-1 | Emotion only; no inline `style=`, no `.css` beyond `globals.css`                   | high     |
| STY-2 | No colour literals in styles; tokens only                                          | high     |
| STY-3 | No raw width media queries; use `mediaUp`/`mediaDown`                              | medium   |
| STY-4 | `"use client"` sits on the styles module, not the component                        | medium   |
| SIZ-1 | No file over 200 lines                                                             | high     |
| TAX-1 | `subtotal` and `hstAmount` stay separate fields; never derive one silently         | high     |
| TAX-2 | `claimablePct` is applied to ITCs and to deductible expense subtotals              | high     |
| TAX-3 | No stored balance — dashboard figures recalculate on read                          | high     |
| DAT-1 | Reads and writes go through the repository port, not a driver directly             | high     |
| NAM-1 | Names are words, not abbreviations; domain vocabulary matches the plan             | medium   |

The catalog is a floor. Report uncovered problems too, and say they are uncovered.

## 5. Report

A score, the gate results, a table of findings (issue, fix, urgency, complexity, files), and a short "verified good" list.

## 6. Review only

Never apply fixes unless asked afterward.
