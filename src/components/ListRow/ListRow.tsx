import { RowBody, RowLink, RowMeta, RowSurface, RowTitle, RowValue } from "./ListRow.styles";
import type { ListRowProps } from "./ListRow.types";

export function ListRow({ meta, title, value, href }: ListRowProps) {
  const body = (
    <>
      <RowBody>
        {meta && <RowMeta>{meta}</RowMeta>}
        <RowTitle>{title}</RowTitle>
      </RowBody>
      <RowValue>{value}</RowValue>
    </>
  );

  if (href) return <RowLink href={href}>{body}</RowLink>;
  return <RowSurface>{body}</RowSurface>;
}
