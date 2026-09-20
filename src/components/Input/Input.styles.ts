"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme, numeric } from "@/src/lib/theme";
import type { InputAlign, InputScale, InputVariant } from "./Input.types";

const SHELLS: Record<InputVariant, ReturnType<typeof css>> = {
  plain: css`
    gap: ${theme.space.sm};
  `,
  default: css`
    gap: ${theme.space.sm};
    min-height: 64px;
    padding: 0 ${theme.space.lg};
    border: 1px solid ${theme.surface.tint};
    border-radius: ${theme.borderRadius.full};
    color: ${theme.foreground.primary};

    html:not([data-input-modality="mouse"]) &:has(:focus-visible) {
      border-color: ${theme.foreground.accent};
    }
  `,
  filled: css`
    gap: ${theme.space.md};
    min-height: 64px;
    padding: 0 ${theme.space.lg};
    border-radius: ${theme.borderRadius.md};
    background: ${theme.surface.secondary};
    color: ${theme.foreground.secondary};

    html:not([data-input-modality="mouse"]) &:has(:focus-visible) {
      outline: 2px solid ${theme.foreground.accent};
      outline-offset: 2px;
    }
  `,
};

const SCALES: Record<InputScale, ReturnType<typeof css>> = {
  md: css`
    font-size: ${theme.fontSize.md};
  `,
  lg: css`
    font-size: ${theme.fontSize.lg};
  `,
  display: css`
    font-family: ${theme.fontFamily.display};
    font-size: ${theme.fontSize["4xl"]};
    font-weight: 400;
  `,
};

export const Shell = styled.label<{ $variant: InputVariant; $isPressable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  cursor: ${({ $isPressable }) => ($isPressable ? "pointer" : "text")};
  ${({ $variant }) => SHELLS[$variant]};
`;

export const ShellBlock = Shell.withComponent("div");

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const Hint = styled.span`
  padding: 0 ${theme.space.lg};
  color: ${theme.foreground.disabled};
  font-size: ${theme.fontSize.xs};
  line-height: 1.4;
`;

export const Label = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  font-size: ${theme.fontSize.md};
  font-weight: 400;
  white-space: nowrap;
`;

export const Glyph = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

export const Value = styled.div<{ $align: InputAlign; $scale: InputScale }>`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: ${({ $align }) => ($align === "end" ? "flex-end" : "flex-start")};
  gap: ${theme.space.xs};
  min-width: 0;
  color: ${theme.foreground.primary};
  ${({ $scale }) => SCALES[$scale]};
`;

export const Affix = styled.span`
  flex: 0 0 auto;
`;

export const Sizer = styled.span`
  ${numeric};
  display: inline-grid;
  min-width: 2.5rem;
  max-width: 100%;

  &::after {
    content: attr(data-value);
    grid-area: 1 / 1;
    padding-inline-end: 1px;
    visibility: hidden;
    white-space: pre;
  }
`;

export const Control = styled.input<{
  $align: InputAlign;
  $isAutoWidth: boolean;
  $isQuiet: boolean;
}>`
  ${numeric};
  flex: ${({ $isAutoWidth }) => ($isAutoWidth ? "0 0 auto" : "1 1 auto")};
  grid-area: 1 / 1;
  width: ${({ $isAutoWidth }) => ($isAutoWidth ? "100%" : "auto")};
  min-width: 0;
  max-width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};
  font: inherit;
  text-align: ${({ $align }) => ($align === "end" ? "right" : "left")};

  &::placeholder {
    color: ${({ $isQuiet }) => ($isQuiet ? theme.foreground.disabled : theme.foreground.secondary)};
  }

  &:focus-visible {
    outline: none;
  }
`;

export const TextControl = styled(Control.withComponent("textarea"))`
  min-height: 72px;
  resize: none;
`;

export const FileInput = styled.input`
  display: none;
`;
