import { removeTransaction } from "@/src/data/server/ledger";
import { handleRoute, noContent } from "@/src/lib/api/respond";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  return handleRoute(async () => {
    const { id } = await context.params;
    await removeTransaction(id);
    return noContent();
  });
}
