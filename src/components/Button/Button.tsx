import { Icon } from "@/src/components/Icon";
import { ButtonBase, ButtonLink } from "./Button.styles";
import type { ButtonProps, LinkButtonProps } from "./Button.types";

export function Button({
  variant = "primary",
  size = "md",
  isBlock = false,
  type = "button",
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <ButtonBase type={type} $variant={variant} $size={size} $isBlock={isBlock} {...rest}>
      {leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </ButtonBase>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  isBlock = false,
  leadingIcon,
  trailingIcon,
  children,
}: LinkButtonProps) {
  return (
    <ButtonLink href={href} $variant={variant} $size={size} $isBlock={isBlock}>
      {leadingIcon && <Icon name={leadingIcon} size={20} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </ButtonLink>
  );
}
