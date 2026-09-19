import * as styles from "./Card.styles";
import type { CardProps } from "./Card.types";

export function Card({ title, action, children }: CardProps) {
  return (
    <styles.Root>
      {(title || action) && (
        <styles.Header>
          {title && <styles.Title>{title}</styles.Title>}
          {action}
        </styles.Header>
      )}
      {children}
    </styles.Root>
  );
}
