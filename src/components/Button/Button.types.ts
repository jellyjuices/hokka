import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type ButtonTone = "accent" | "soft" | "quiet" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type Shared = {
  tone?: ButtonTone;
  size?: ButtonSize;
  isBlock?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  children: ReactNode;
};

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & Shared;

export type LinkButtonProps = Shared & {
  href: string;
};
