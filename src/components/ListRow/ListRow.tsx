import * as styles from "./ListRow.styles";
import type { ListRowProps } from "./ListRow.types";

export function ListRow({ meta, title, value, href }: ListRowProps) {
  const body = (
    <>
      <styles.Body>
        {meta && <styles.Meta>{meta}</styles.Meta>}
        <styles.Title>{title}</styles.Title>
      </styles.Body>
      <styles.Value>{value}</styles.Value>
    </>
  );

  if (href) return <styles.RootLink href={href}>{body}</styles.RootLink>;
  return <styles.Root>{body}</styles.Root>;
}
