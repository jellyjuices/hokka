"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xs};
`;

export const FieldLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${theme.foreground.secondary};
`;

export const FieldHint = styled.span`
  font-size: 0.78rem;
  color: ${theme.foreground.disabled};
`;

export const FieldInput = styled.input`
  padding: ${theme.space.sm} ${theme.space.md};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.surface.primary};
  color: ${theme.foreground.primary};

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 1px;
  }
`;
