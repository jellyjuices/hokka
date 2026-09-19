import { Icon } from "@/src/components/Icon";
import * as styles from "./StatTile.styles";
import type { StatTileProps } from "./StatTile.types";

export function StatTile({
  label,
  value,
  caption,
  icon,
  tone = "neutral",
  size = "display",
  badge,
}: StatTileProps) {
  return (
    <styles.Root $tone={tone} $size={size}>
      {badge && <styles.Badge>{badge}</styles.Badge>}
      <styles.Label>
        {icon && <Icon name={icon} size={22} />}
        {label}
      </styles.Label>
      <styles.Value $size={size}>{value}</styles.Value>
      {caption && <styles.Caption $tone={tone}>{caption}</styles.Caption>}
    </styles.Root>
  );
}
