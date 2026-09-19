import { CardHeader, CardSurface, CardTitle } from "./Card.styles";
import type { CardProps } from "./Card.types";

export function Card({ title, action, children }: CardProps) {
  return (
    <CardSurface>
      {(title || action) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {action}
        </CardHeader>
      )}
      {children}
    </CardSurface>
  );
}
