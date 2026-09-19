import type { CSSProperties } from "react";
import * as styles from "./Grid.styles";
import type { GridItemProps, GridProps } from "./Grid.types";

export function Grid({ as, children }: GridProps) {
  return <styles.Root as={as}>{children}</styles.Root>;
}

export function GridItem({
  span = 12,
  spanTablet,
  spanMobile,
  rowSpan = 1,
  children,
}: GridItemProps) {
  const spans = {
    "--span": span,
    "--span-tablet": spanTablet ?? span,
    "--span-mobile": spanMobile ?? spanTablet ?? span,
    "--row-span": rowSpan,
  } as CSSProperties;

  return <styles.Item style={spans}>{children}</styles.Item>;
}
