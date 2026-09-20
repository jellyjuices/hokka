import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconName } from "@/src/components/Icon";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type Shared = {
  variant?: ButtonVariant;
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
