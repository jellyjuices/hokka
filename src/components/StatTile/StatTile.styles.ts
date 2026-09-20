"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme, numeric } from "@/src/lib/theme";
import type { StatTileSize, StatTileVariant } from "./StatTile.types";

const variants: Record<StatTileVariant, ReturnType<typeof css>> = {
  secondary: css`
    background: ${theme.surface.secondary};
    color: ${theme.foreground.primary};
  `,
  primary: css`
    background: ${theme.surface.accent};
    color: ${theme.foreground.inverse};
  `,
};

const sizes: Record<StatTileSize, ReturnType<typeof css>> = {
  display: css`
    min-height: 220px;
  `,
  compact: css`
    min-height: 0;
  `,
};

export const TileSurface = styled.div<{ $variant: StatTileVariant; $size: StatTileSize }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: ${theme.space.xs};
  padding: ${theme.space.xl};
  border-radius: ${theme.borderRadius.lg};
  ${({ $variant }) => variants[$variant]};
  ${({ $size }) => sizes[$size]};
`;

export const TileLabel = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  font-size: ${theme.fontSize.lg};
  font-weight: 500;
  color: inherit;
`;

export const TileValue = styled.strong<{ $size: StatTileSize }>`
  ${numeric}
  font-family: ${theme.fontFamily.display};
  font-size: ${({ $size }) => ($size === "display" ? theme.fontSize["4xl"] : theme.fontSize["3xl"])};
  font-weight: 500;
  line-height: 1.1;
`;

export const TileCaption = styled.span<{ $variant: StatTileVariant }>`
  font-size: ${theme.fontSize.sm};
  color: ${({ $variant }) => ($variant === "primary" ? "inherit" : theme.foreground.secondary)};
  opacity: ${({ $variant }) => ($variant === "primary" ? 0.86 : 1)};
`;

export const TileBadge = styled.div`
  position: absolute;
  top: ${theme.space.lg};
  right: ${theme.space.lg};
`;
