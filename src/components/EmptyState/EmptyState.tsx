import {
  EmptyStateDescription,
  EmptyStateLayout,
  EmptyStateTitle,
  EmptyConentWrapper,
} from "./EmptyState.styles";
import type { EmptyStateProps } from "./EmptyState.types";

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <EmptyStateLayout>
      <EmptyConentWrapper>
        {icon}
        <EmptyStateTitle>{title}</EmptyStateTitle>
        {description && <EmptyStateDescription>{description}</EmptyStateDescription>}
      </EmptyConentWrapper>
      {action}
    </EmptyStateLayout>
  );
}
