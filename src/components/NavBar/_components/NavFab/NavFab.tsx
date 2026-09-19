import { Icon } from "@/src/components/Icon";
import { FabLink } from "./NavFab.styles";

export function NavFab() {
  return (
    <FabLink href="/transaction/new" aria-label="New transaction">
      New transaction
      <Icon name="plus" size={24} />
    </FabLink>
  );
}
