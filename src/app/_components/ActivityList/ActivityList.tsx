import { LinkButton } from "@/src/components/Button";
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
}: ActivityListProps) {
  return (
    <ActivitySection $visibility={visibility}>
      <ActivityTitle>{title}</ActivityTitle>
      {items.length === 0 ? (
        <EmptyState
          icon={<Icon name="receipt" size={32} weight="fill" />}
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
      <ActivityFooter>
        <LinkButton href={ctaHref} tone="soft" isBlock trailingIcon="arrowRight">
          {ctaLabel}
        </LinkButton>
      </ActivityFooter>
    </ActivitySection>
  );
}
