import { ChipTag } from "./Chip.styles";
import type { ChipProps } from "./Chip.types";

export function Chip({ children }: ChipProps) {
  return <ChipTag>{children}</ChipTag>;
}
