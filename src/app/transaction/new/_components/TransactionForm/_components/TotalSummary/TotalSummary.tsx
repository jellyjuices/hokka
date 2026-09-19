import { Icon } from "@/src/components/Icon";
import { formatAmount } from "@/src/lib/money";
import {
  SummaryAmount,
  SummaryBlock,
  SummaryLabel,
  SummaryNote,
  SummaryRow,
} from "./TotalSummary.styles";
import type { TotalSummaryProps } from "./TotalSummary.types";

export function TotalSummary({ direction, total, claimBack }: TotalSummaryProps) {
  const note =
    direction === "expense"
      ? `You're getting $${formatAmount(claimBack)} back!`
      : `You're holding $${formatAmount(claimBack)} in HST for the CRA.`;

  return (
    <SummaryBlock>
      <SummaryRow>
        <SummaryLabel>
          <Icon name="dollar" size={26} />
          Total
        </SummaryLabel>
        <SummaryAmount>{formatAmount(total)}</SummaryAmount>
      </SummaryRow>
      {!!claimBack && (
        <SummaryNote>
          <Icon name="claim" size={18} />
          {note}
        </SummaryNote>
      )}
    </SummaryBlock>
  );
}
