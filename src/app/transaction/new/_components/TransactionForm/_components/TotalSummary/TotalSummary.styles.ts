"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const SummaryBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
  padding-top: ${theme.space.md};
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${theme.space.md};
`;

export const SummaryLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.sm};
  color: ${theme.foreground.primary};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["2xl"]};
  font-weight: 500;
  letter-spacing: -0.02em;
`;

export const SummaryAmount = styled.span`
  color: ${theme.foreground.primary};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["3xl"]};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
`;

export const SummaryNote = styled.p`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  margin: 0;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
`;
