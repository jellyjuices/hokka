import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export type IconName = PhosphorIcon;

export type IconProps = {
  name: IconName;
  size?: number;
  weight?: "regular" | "duotone" | "fill" | "bold";
};
