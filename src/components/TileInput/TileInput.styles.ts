"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { AmountInput, softField } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";

const tile = css`
  ${softField};
  justify-content: space-between;
  cursor: pointer;
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

export const TileValue = styled(AmountInput)`
  &::placeholder {
    color: ${theme.foreground.secondary};
  }
`;
