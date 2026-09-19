import type { IconName } from "./Icon.registry";

export type IconProps = {
  name: IconName;
  size?: number;
  weight?: "regular" | "duotone" | "fill" | "bold";
};
