import { CoinsIcon, HandCoinsIcon, PaperclipIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/src/components/Icon";
import { findCategory } from "@/src/data/categories";
import { formatCurrency } from "@/src/lib/money";
import { formatDate } from "@/src/lib/dates";
import {
  CardAction,
  CardAmounts,
  CardBody,
  CardGlyph,
  CardMeta,
  CardMetaBadge,
  CardMetaDot,
  CardMetaText,
  CardLink,
  CardShell,
  CardSubAmount,
  CardTitle,
  CardTotal,
} from "./TransactionCard.styles";
import type { TransactionCardProps } from "./TransactionCard.types";

export function TransactionCard({ transaction, href, action }: TransactionCardProps) {
  const isIncome = transaction.direction === "income";
  const title = transaction.counterparty || transaction.notes || "Untitled";
  const category = findCategory(transaction.category);
  const attachmentCount = transaction.documentIds.length;

  return (
    <CardShell>
      <CardGlyph $isIncome={isIncome}>
        <Icon name={isIncome ? HandCoinsIcon : CoinsIcon} size={24} />
      </CardGlyph>
      <CardBody>
        <CardTitle>
          {href === undefined ? title : <CardLink href={href}>{title}</CardLink>}
        </CardTitle>
        <CardMeta>
          <CardMetaText>{category?.label ?? "Uncategorised"}</CardMetaText>
          <CardMetaDot aria-hidden="true" />
          <CardMetaText>{formatDate(transaction.txnDate)}</CardMetaText>
          {transaction.claimablePct < 100 && (
            <>
              <CardMetaDot aria-hidden="true" />
              <CardMetaText>{`${transaction.claimablePct}% claimable`}</CardMetaText>
            </>
          )}
          {attachmentCount > 0 && (
            <CardMetaBadge aria-label={`${attachmentCount} attached`}>
              <Icon name={PaperclipIcon} size={14} />
              {attachmentCount}
            </CardMetaBadge>
          )}
        </CardMeta>
      </CardBody>
      <CardAmounts>
        <CardTotal $isIncome={isIncome}>
          {`${isIncome ? "+" : "−"}${formatCurrency(transaction.total)}`}
        </CardTotal>
        <CardSubAmount>{`HST ${formatCurrency(transaction.hstAmount)}`}</CardSubAmount>
      </CardAmounts>
      {action !== undefined && <CardAction>{action}</CardAction>}
    </CardShell>
  );
}
