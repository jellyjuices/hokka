"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme, numeric } from "@/src/lib/theme";

const tile = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  min-height: 64px;
  padding: 0 ${theme.space.lg};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  cursor: pointer;

  &:has(:focus-visible) {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }
`;

export const TileGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const TileShell = styled.label`
  ${tile};
`;

export const TileBlock = styled.div`
  ${tile};
`;

export const TileLabel = styled.span`
  flex: 0 1 auto;
  min-width: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.md};
`;

export const TileHint = styled.span`
  padding: 0 ${theme.space.lg};
  color: ${theme.foreground.disabled};
  font-size: ${theme.fontSize.xs};
  line-height: 1.4;
`;

export const TileValue = styled.input`
  ${numeric}
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};
  font-family: ${theme.fontFamily.text};
  font-size: ${theme.fontSize.md};
  text-align: right;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: ${theme.foreground.secondary};
  }

  &:focus-visible {
    outline: none;
  }
`;
