import type {
  ChangeEventHandler,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type { IconName } from "@/src/components/Icon";

export type InputVariant = "plain" | "default" | "filled";
export type InputScale = "md" | "lg" | "display";
export type InputAlign = "start" | "end";
export type InputSide = "leading" | "trailing";

export type InputShellProps = {
  children: ReactNode;
  variant?: InputVariant;
  label?: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  isPressable?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLLabelElement | HTMLDivElement>, "children">;

type NativeProps = Omit<ComponentPropsWithoutRef<"input">, "onChange" | "prefix" | "size">;

export type InputProps = NativeProps & {
  ref?: Ref<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  variant?: InputVariant;
  scale?: InputScale;
  align?: InputAlign;
  label?: ReactNode;
  hint?: ReactNode;
  icon?: IconName;
  iconSide?: InputSide;
  iconSize?: number;
  prependValue?: string;
  appendValue?: string;
  isAutoWidth?: boolean;
  isMultiline?: boolean;
  children?: ReactNode;
  className?: string;
};
