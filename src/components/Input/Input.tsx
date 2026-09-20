"use client";

import { Icon } from "@/src/components/Icon";
import {
  Affix,
  Control,
  Glyph,
  Group,
  Hint,
  Label,
  Shell,
  Sizer,
  TextControl,
  Value,
} from "./Input.styles";
import type { InputProps } from "./Input.types";

export function Input({
  variant = "default",
  scale = "md",
  align = "start",
  label,
  hint,
  icon,
  iconSide = "trailing",
  iconSize = 22,
  prependValue,
  appendValue,
  isAutoWidth = false,
  isMultiline = false,
  children,
  className,
  ...control
}: InputProps) {
  const Field = (isMultiline ? TextControl : Control) as typeof Control;
  const field = (
    <Field
      $align={align}
      $isAutoWidth={isAutoWidth}
      $isQuiet={align === "end" || scale === "display"}
      {...control}
    />
  );
  const glyph =
    icon === undefined ? null : (
      <Glyph aria-hidden="true">
        <Icon name={icon} size={iconSize} />
      </Glyph>
    );

  const shell = (
    <Shell
      className={hint === undefined ? className : undefined}
      htmlFor={control.id}
      $variant={variant}
      $isPressable={false}
    >
      {iconSide === "leading" && glyph}
      {label === undefined ? null : <Label>{label}</Label>}
      <Value $align={align} $scale={scale}>
        {prependValue === undefined ? null : <Affix aria-hidden="true">{prependValue}</Affix>}
        {isAutoWidth ? <Sizer data-value={sizerText(control)}>{field}</Sizer> : field}
        {appendValue === undefined ? null : <Affix aria-hidden="true">{appendValue}</Affix>}
      </Value>
      {iconSide === "trailing" && glyph}
      {children}
    </Shell>
  );

  if (hint === undefined) return shell;

  return (
    <Group className={className}>
      {shell}
      <Hint>{hint}</Hint>
    </Group>
  );
}

function sizerText({ value, placeholder }: { value?: unknown; placeholder?: string }) {
  return String(value ?? "") || (placeholder ?? "");
}
