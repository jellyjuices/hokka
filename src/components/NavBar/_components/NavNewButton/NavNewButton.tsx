import { Icon } from "@/src/components/Icon";
import { NewButtonLabel, NewButtonLink } from "./NavNewButton.styles";
import type { NavNewButtonProps } from "./NavNewButton.types";

export function NavNewButton({ isCollapsed }: NavNewButtonProps) {
  return (
    <NewButtonLink href="/transaction/new" $isCollapsed={isCollapsed} aria-label="New transaction">
      <Icon name="plus" size={24} />
      <NewButtonLabel $isCollapsed={isCollapsed} aria-hidden={isCollapsed}>
        New
      </NewButtonLabel>
    </NewButtonLink>
  );
}
