"use client";

import { Button } from "@/src/components/Button";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { buildLedgerCsv, ledgerCsvFileName } from "@/src/lib/ledgerCsv";
import { downloadText } from "@/src/lib/platform/download";
import type { ExportButtonProps } from "./ExportButton.types";

const CSV_TYPE = "text/csv;charset=utf-8";

export function ExportButton({ transactions, range }: ExportButtonProps) {
  function handleExport() {
    downloadText(ledgerCsvFileName(range), buildLedgerCsv(transactions, range), CSV_TYPE);
  }

  return (
    <Button
      type="button"
      variant="tertiary"
      size="sm"
      leadingIcon={DownloadSimpleIcon}
      disabled={transactions.length === 0}
      onClick={handleExport}
    >
      Export CSV
    </Button>
  );
}
