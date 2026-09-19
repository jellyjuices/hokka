import { LinkButton } from "@/src/components/Button";
import { EmptyState } from "@/src/components/EmptyState";
import { ListRow } from "@/src/components/ListRow";
import * as styles from "./ActivityList.styles";
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
    <styles.Root $visibility={visibility}>
      <styles.Title>{title}</styles.Title>
      {items.length === 0 ? (
        <EmptyState icon="receipt" title={emptyTitle} description={emptyDescription} />
      ) : (
        <styles.Items>
          {items.map((item) => (
            <li key={item.id}>
              <ListRow meta={item.meta} title={item.title} value={item.value} href={item.href} />
            </li>
          ))}
        </styles.Items>
      )}
      <styles.Footer>
        <LinkButton href={ctaHref} tone="soft" isBlock trailingIcon="arrowRight">
          {ctaLabel}
        </LinkButton>
      </styles.Footer>
    </styles.Root>
  );
}
