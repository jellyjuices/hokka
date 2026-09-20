import { AnimatedNumber } from "@/src/components/AnimatedNumber";
import { ArrowElbowDownRightIcon, CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr";
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
          <Icon name={CurrencyDollarIcon} size={26} />
          Total
        </SummaryLabel>
        <SummaryAmount>
          <span aria-hidden="true">$</span>
          <AnimatedNumber value={total} format={formatAmount} />
        </SummaryAmount>
      </SummaryRow>
      {!!claimBack && (
        <SummaryNote>
          <Icon name={ArrowElbowDownRightIcon} size={18} />
          {note}
        </SummaryNote>
      )}
    </SummaryBlock>
  );
}
