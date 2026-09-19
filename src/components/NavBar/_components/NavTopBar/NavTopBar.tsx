import * as styles from "./NavTopBar.styles";
import type { NavTopBarProps } from "./NavTopBar.types";

export function NavTopBar({ brand }: NavTopBarProps) {
  return (
    <styles.Root>
      <styles.Brand href="/">
        <styles.BrandMark src="/logo/ui.svg" alt="" width={30} height={30} />
        <styles.BrandName>{brand}</styles.BrandName>
      </styles.Brand>
    </styles.Root>
  );
}
