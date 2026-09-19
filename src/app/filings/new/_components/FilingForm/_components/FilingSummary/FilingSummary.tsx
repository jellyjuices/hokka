import { Icon } from "@/src/components/Icon";
import { formatAmount, roundToCents } from "@/src/lib/money";
import {
  SummaryAmount,
  SummaryBlock,
  SummaryLabel,
  SummaryNote,
  SummaryRow,
} from "./FilingSummary.styles";
import type { FilingSummaryProps } from "./FilingSummary.types";

export function FilingSummary({ amountFiled, outstanding, periodTitle }: FilingSummaryProps) {
  const remaining = roundToCents(outstanding - amountFiled);
  const note =
    remaining > 0
      ? `$${formatAmount(remaining)} still owing for ${periodTitle}.`
      : `This clears ${periodTitle}.`;

  return (
    <SummaryBlock>
      <SummaryRow>
        <SummaryLabel>
          <Icon name="dollar" size={26} />
          Filing
        </SummaryLabel>
        <SummaryAmount>{formatAmount(amountFiled)}</SummaryAmount>
      </SummaryRow>
      {outstanding > 0 && (
        <SummaryNote>
          <Icon name="claim" size={18} />
          {note}
        </SummaryNote>
      )}
    </SummaryBlock>
  );
}
