import { Icon } from "@/src/components/Icon";
import * as styles from "./EmptyState.styles";
import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <styles.Root>
      <Icon name={icon} size={32} weight="duotone" />
      <styles.Title>{title}</styles.Title>
      <styles.Description>{description}</styles.Description>
      {action}
    </styles.Root>
  );
}
