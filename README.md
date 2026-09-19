# Hokka

HST and income-tax tracking for a single Ontario sole proprietor. Paid invoices and business receipts go in, each split into a pre-tax amount and an HST amount; the dashboard reports net HST owing and a running income-tax reserve.

- Architecture and invariants: [AGENTS.md](AGENTS.md)
- Product plan: [hst-expense-manager-project.md](../hst-expense-manager-project.md)
- House style: [REPO_GUIDELINES.md](../REPO_GUIDELINES.md)

```sh
npm install
npm run dev
```

Gates, run before any commit: `npm run check` (typecheck, lint, file size) and `npm run build`.

Status: scaffold. Routes and components are wired; the calculation engine, persistence, capture pipeline and exports are stubs.
