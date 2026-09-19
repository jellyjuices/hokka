import { Icon } from "@/src/components/Icon";
import { TileBadge, TileCaption, TileLabel, TileSurface, TileValue } from "./StatTile.styles";
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
    <TileSurface $tone={tone} $size={size}>
      {badge && <TileBadge>{badge}</TileBadge>}
      <TileLabel>
        {icon && <Icon name={icon} size={22} />}
        {label}
      </TileLabel>
      <TileValue $size={size}>{value}</TileValue>
      {caption && <TileCaption $tone={tone}>{caption}</TileCaption>}
    </TileSurface>
  );
}
