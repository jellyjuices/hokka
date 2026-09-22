"use client";

import type { MouseEvent } from "react";
import { Label, Shell, ShellBlock } from "./Input.styles";
import type { InputShellProps } from "./Input.types";

const ACTIVATABLE = "button, input:not([type='hidden']), textarea, [contenteditable='true']";

function activateControl(event: MouseEvent<HTMLDivElement>) {
  if (event.target instanceof Element && event.target.closest(ACTIVATABLE) !== null) return;
  const control = event.currentTarget.querySelector<HTMLElement>(ACTIVATABLE);
  if (control === null) return;
  if (control.isContentEditable) control.focus();
  else control.click();
}

export function InputShell({
  children,
  variant = "default",
  label,
  htmlFor,
  isPressable = false,
  ...rest
}: InputShellProps) {
  const slots = (
    <>
      {label === undefined ? null : <Label>{label}</Label>}
      {children}
    </>
  );

  return htmlFor === undefined ? (
    <ShellBlock
      $variant={variant}
      $isPressable={isPressable || true}
      {...rest}
      onClick={activateControl}
    >
      {slots}
    </ShellBlock>
  ) : (
    <Shell htmlFor={htmlFor} $variant={variant} $isPressable={isPressable || false} {...rest}>
      {slots}
    </Shell>
  );
}
