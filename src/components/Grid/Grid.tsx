import { GridCell, GridLayout } from "./Grid.styles";
import type { GridItemProps, GridProps } from "./Grid.types";

export function Grid({ as, children }: GridProps) {
  return <GridLayout as={as}>{children}</GridLayout>;
}

export function GridItem({
  span = 12,
  spanTablet,
  spanMobile,
  rowSpan = 1,
  children,
}: GridItemProps) {
  return (
    <GridCell
      $span={span}
      $spanTablet={spanTablet ?? span}
      $spanMobile={spanMobile ?? spanTablet ?? span}
      $rowSpan={rowSpan}
    >
      {children}
    </GridCell>
  );
}
