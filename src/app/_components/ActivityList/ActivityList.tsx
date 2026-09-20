import { LinkButton } from "@/src/components/Button";
import { ArrowRightIcon, ReceiptIcon } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@/src/components/EmptyState";
import { Icon } from "@/src/components/Icon";
import { ListRow } from "@/src/components/ListRow";
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
}: ActivityListProps) {
  return (
    <ActivitySection $visibility={visibility}>
      <ActivityTitle>{title}</ActivityTitle>
      {items.length === 0 ? (
        <EmptyState
          icon={<Icon name={icon} size={32} weight="fill" />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <ActivityItems>
          {items.map((item) => (
            <li key={item.id}>
              <ListRow meta={item.meta} title={item.title} value={item.value} href={item.href} />
            </li>
          ))}
        </ActivityItems>
      )}
      {items.length !== 0 && (
        <ActivityFooter>
          <LinkButton href={ctaHref} variant="secondary" isBlock trailingIcon={ArrowRightIcon}>
            {ctaLabel}
          </LinkButton>
        </ActivityFooter>
      )}
    </ActivitySection>
  );
}
