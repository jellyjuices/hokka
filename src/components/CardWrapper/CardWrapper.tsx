import { WrapperRoot } from "./CardWrapper.styles";
import type { CardWrapperProps } from "./CardWrapper.types";

export function CardWrapper({
  children,
  direction = "row",
  stackOnMobile = false,
  className,
}: CardWrapperProps) {
  return (
    <WrapperRoot className={className} $direction={direction} $stackOnMobile={stackOnMobile}>
      {children}
    </WrapperRoot>
  );
}
