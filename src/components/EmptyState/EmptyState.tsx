import { Icon } from "@/src/components/Icon";
import { EmptyStateDescription, EmptyStateLayout, EmptyStateTitle } from "./EmptyState.styles";
import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <EmptyStateLayout>
      <Icon name={icon} size={32} weight="fill" />
      <EmptyStateTitle>{title}</EmptyStateTitle>
      {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
      {action}
    </EmptyStateLayout>
  );
}
