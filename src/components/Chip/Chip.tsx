import * as styles from "./Chip.styles";
import type { ChipProps } from "./Chip.types";

export function Chip({ children }: ChipProps) {
  return <styles.Root>{children}</styles.Root>;
}
