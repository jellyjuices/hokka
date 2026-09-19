import type { Transaction } from "@/src/data/domain.types";
import { saveTransaction } from "@/src/data/server/ledger";
import { handleRoute, jsonResponse } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const transaction = (await request.json()) as Transaction;
    return jsonResponse(await saveTransaction(transaction));
  });
}
