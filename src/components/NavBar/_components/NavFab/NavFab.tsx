import { Icon } from "@/src/components/Icon";
import * as styles from "./NavFab.styles";

export function NavFab() {
  return (
    <styles.Root href="/new">
      New
      <Icon name="plus" size={24} />
    </styles.Root>
  );
}
