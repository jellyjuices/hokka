import { listPeriodTransactions } from "@/src/data/server/ledger";
import { handleRoute, jsonError } from "@/src/lib/http";
import { transactionsToCsv } from "@/src/lib/csv";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleRoute(async () => {
    const params = new URL(request.url).searchParams;
    const periodId = params.get("periodId");
    const format = params.get("format") ?? "csv";

    if (!periodId) return jsonError("periodId is required", 400);
    if (format !== "csv") return jsonError(`Unsupported export format: ${format}`, 400);

    const transactions = await listPeriodTransactions(periodId);

    return new Response(transactionsToCsv(transactions), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="hokka-${periodId}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  });
}
