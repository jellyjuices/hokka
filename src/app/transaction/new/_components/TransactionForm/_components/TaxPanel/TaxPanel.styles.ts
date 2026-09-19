"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const TaxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const TaxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.md};
  min-height: 64px;
  padding: 0 ${theme.space.lg};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
`;

export const TaxLabel = styled.label`
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
`;

export const ModifierRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.space.sm};

  ${mediaDown("mobile")} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ModifierField = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space.sm};
  min-height: 64px;
  padding: 0 ${theme.space.lg};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.full};
  color: ${theme.foreground.primary};
  cursor: text;

  &:focus-within {
    border-color: ${theme.foreground.accent};
  }
`;

export const ModifierLabel = styled.span`
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  white-space: nowrap;
`;

export const ModifierValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.space.xs};
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
`;

export const ModifierInput = styled.input`
  width: 4.5rem;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};
  font-size: ${theme.fontSize.md};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: right;

  &::placeholder {
    color: ${theme.foreground.disabled};
  }

  &:focus-visible {
    outline: none;
  }
`;
