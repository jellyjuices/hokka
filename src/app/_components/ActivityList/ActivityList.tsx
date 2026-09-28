import { LinkButton } from "@/src/components/Button";
import { ArrowRightIcon, ReceiptIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { FilingCard } from "@/src/components/FilingCard";
import { SkeletonList } from "@/src/components/Skeleton";
import { TransactionCard } from "@/src/components/TransactionCard";
import {
  ActivityFooter,
  ActivityItems,
  ActivitySection,
  ActivityTitle,
} from "./ActivityList.styles";
import type { ActivityListProps } from "./ActivityList.types";

export function ActivityList({
  title,
  items,
  emptyTitle,
  emptyDescription,
  ctaHref,
  ctaLabel,
  visibility = "all",
  icon = ReceiptIcon,
  isLoading = false,
}: ActivityListProps) {
  return (
    <ActivitySection $visibility={visibility}>
      <ActivityTitle>{title}</ActivityTitle>
      {isLoading ? (
        <SkeletonList label={`Loading ${title.toLowerCase()}`} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Icon name={icon} size={32} weight="fill" />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <ActivityItems>
          {items.map((item) => (
            <li key={item.kind === "transaction" ? item.transaction.id : item.filing.id}>
              {item.kind === "transaction" ? (
                <TransactionCard transaction={item.transaction} />
              ) : (
                <FilingCard filing={item.filing} />
              )}
            </li>
          ))}
        </ActivityItems>
      )}
      {!isLoading && items.length !== 0 && (
        <ActivityFooter>
          <LinkButton href={ctaHref} variant="secondary" isBlock trailingIcon={ArrowRightIcon}>
            {ctaLabel}
          </LinkButton>
        </ActivityFooter>
      )}
    </ActivitySection>
  );
}
