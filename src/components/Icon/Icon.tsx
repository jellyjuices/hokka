import { ICONS } from "./Icon.registry";
import type { IconProps } from "./Icon.types";

export function Icon({ name, size = 20, weight = "regular" }: IconProps) {
  const Glyph = ICONS[name];
  return <Glyph size={size} weight={weight} />;
}
