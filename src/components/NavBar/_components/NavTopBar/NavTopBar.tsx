import { TopBar, TopBarBrand, TopBarBrandMark, TopBarBrandName } from "./NavTopBar.styles";
import type { NavTopBarProps } from "./NavTopBar.types";

export function NavTopBar({ brand }: NavTopBarProps) {
  return (
    <TopBar>
      <TopBarBrand href="/">
        <TopBarBrandMark src="/logo/ui.svg" alt="" width={30} height={30} />
        <TopBarBrandName>{brand}</TopBarBrandName>
      </TopBarBrand>
    </TopBar>
  );
}
