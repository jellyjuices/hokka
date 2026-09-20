import type { IconProps } from "./Icon.types";

export function Icon({ name: Glyph, size = 20, weight = "regular" }: IconProps) {
  return <Glyph size={size} weight={weight} />;
}
