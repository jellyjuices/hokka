"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { theme, hoverFill } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/theme";
import type { ButtonSize, ButtonVariant } from "./Button.types";

function variantStyle(background: string, color: string) {
  return css`
    background: ${background};
    color: ${color};

    &:hover:not(:disabled) {
      background: ${hoverFill(background)};
    }
  `;
}

const variants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: variantStyle(theme.surface.accent, theme.foreground.inverse),
  secondary: variantStyle(theme.surface.secondary, theme.foreground.primary),
  tertiary: variantStyle(theme.surface.accentSecondary, theme.foreground.accent),
  ghost: variantStyle("transparent", theme.foreground.secondary),
};

const sizes: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    min-height: 36px;
    padding: 0 ${theme.space.md};
    font-size: ${theme.fontSize.xs};
  `,
  md: css`
    min-height: 44px;
    padding: 0 ${theme.space.lg};
    font-size: ${theme.fontSize.sm};
  `,
  lg: css`
    min-height: 56px;
    padding: 0 ${theme.space.xl};
    font-size: ${theme.fontSize.md};
  `,
};

const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
  border: none;
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transition:
    background ${theme.motion.fast} ease,
    opacity ${theme.motion.fast} ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

type Variant = { $variant: ButtonVariant; $size: ButtonSize; $isBlock: boolean };

const variant = ({ $variant, $size, $isBlock }: Variant) => css`
  ${variants[$variant]};
  ${sizes[$size]};
  ${
    $isBlock &&
    css`
      display: flex;
      width: 100%;
      justify-content: space-between;
    `
  };
`;

export const ButtonBase = styled.button<Variant>`
  ${base};
  ${variant};
`;

export const ButtonLink = styled(Link, transientProps)<Variant>`
  ${base};
  ${variant};
`;
