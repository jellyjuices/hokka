import { exportUrl } from "./remote";

export type ExportFormat = "csv";

export async function exportPeriod(taxPeriodId: string, format: ExportFormat): Promise<Blob> {
  const response = await fetch(exportUrl(taxPeriodId, format), { cache: "no-store" });
  if (!response.ok) throw new Error(`Export failed with ${response.status}`);
  return response.blob();
}

export async function downloadPeriodExport(taxPeriodId: string, format: ExportFormat) {
  const blob = await exportPeriod(taxPeriodId, format);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hokka-${taxPeriodId}.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}
