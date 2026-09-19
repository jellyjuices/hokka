"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { theme } from "@/src/lib/theme";
import { transientProps } from "@/src/lib/styled";
import type { ButtonSize, ButtonTone } from "./Button.types";

const tones: Record<ButtonTone, ReturnType<typeof css>> = {
  accent: css`
    background: ${theme.surface.accent};
    color: ${theme.foreground.inverse};
  `,
  soft: css`
    background: ${theme.surface.accentSecondary};
    color: ${theme.foreground.accent};
  `,
  quiet: css`
    background: ${theme.surface.secondary};
    color: ${theme.foreground.primary};
  `,
  ghost: css`
    background: transparent;
    color: ${theme.foreground.secondary};
  `,
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
  transition: filter ${theme.motion.fast};

  &:hover {
    filter: brightness(0.96);
  }

  &:disabled {
    color: ${theme.foreground.disabled};
    cursor: not-allowed;
    filter: none;
  }
`;

type Variant = { $tone: ButtonTone; $size: ButtonSize; $isBlock: boolean };

const variant = ({ $tone, $size, $isBlock }: Variant) => css`
  ${tones[$tone]};
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

export const Root = styled.button<Variant>`
  ${base};
  ${variant};
`;

export const RootLink = styled(Link, transientProps)<Variant>`
  ${base};
  ${variant};
`;
