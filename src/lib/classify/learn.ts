import type { ReceiptReading } from "@/src/lib/ocr/ocr.types";
import { receiptText } from "./keywords";
import { rememberCategory } from "./memory";

export async function rememberReceipt(reading: ReceiptReading, categoryId: string) {
  const receipt = reading.receipt;
  if (receipt === null) return;
  const lines = reading.text.split("\n");
  await rememberCategory(receiptText(receipt.vendor || null, receipt.items, lines), categoryId);
}
