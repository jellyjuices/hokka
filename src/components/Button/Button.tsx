import { Icon } from "@/src/components/Icon";
import * as styles from "./Button.styles";
import type { ButtonProps, LinkButtonProps } from "./Button.types";

export function Button({
  tone = "accent",
  size = "md",
  isBlock = false,
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <styles.Root $tone={tone} $size={size} $isBlock={isBlock} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </styles.Root>
  );
}

export function LinkButton({
  href,
  tone = "quiet",
  size = "md",
  isBlock = false,
  leadingIcon,
  trailingIcon,
  children,
}: LinkButtonProps) {
  return (
    <styles.RootLink href={href} $tone={tone} $size={size} $isBlock={isBlock}>
      {leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </styles.RootLink>
  );
}
