"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import type { StatTileSize, StatTileTone } from "./StatTile.types";

const tones: Record<StatTileTone, ReturnType<typeof css>> = {
  neutral: css`
    background: ${theme.surface.secondary};
    color: ${theme.foreground.primary};
  `,
  accent: css`
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

export const TileSurface = styled.div<{ $tone: StatTileTone; $size: StatTileSize }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: ${theme.space.xs};
  padding: ${theme.space.xl};
  border-radius: ${theme.borderRadius.lg};
  ${({ $tone }) => tones[$tone]};
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
  font-family: ${theme.fontFamily.display};
  font-size: ${({ $size }) => ($size === "display" ? theme.fontSize["4xl"] : theme.fontSize["3xl"])};
  font-weight: 500;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

export const TileCaption = styled.span<{ $tone: StatTileTone }>`
  font-size: ${theme.fontSize.sm};
  color: ${({ $tone }) => ($tone === "accent" ? "inherit" : theme.foreground.secondary)};
  opacity: ${({ $tone }) => ($tone === "accent" ? 0.86 : 1)};
`;

export const TileBadge = styled.div`
  position: absolute;
  top: ${theme.space.lg};
  right: ${theme.space.lg};
`;
