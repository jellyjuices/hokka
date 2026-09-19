"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { css } from "@emotion/react";
import { theme } from "@/src/lib/theme";

const base = css`
  display: flex;
  align-items: center;
  gap: ${theme.space.md};
  min-height: 64px;
  padding: ${theme.space.md} ${theme.space.lg};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.primary};
`;

export const Root = styled.div`
  ${base};
`;

export const RootLink = styled(Link)`
  ${base};
  transition: border-color ${theme.motion.fast} ease;

  &:hover {
    border-color: ${theme.foreground.accent};
  }
`;

export const Body = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  align-items: flex-start;
  flex: 1 1 auto;
  min-width: 0;
`;

export const Meta = styled.span`
  font-size: ${theme.fontSize.xs};
  color: ${theme.foreground.secondary};
  line-height: 1.2;
`;

export const Title = styled.span`
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${theme.fontSize.md};
  color: ${theme.foreground.primary};
`;

export const Value = styled.strong`
  flex: 0 0 auto;
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
`;
