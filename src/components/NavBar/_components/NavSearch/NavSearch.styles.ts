"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const CollapsedButton = styled.button`
  display: grid;
  place-items: center;
  align-self: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.primary};
  cursor: pointer;
  transition: filter ${theme.motion.fast};

  &:hover {
    filter: brightness(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 3px;
  }
`;

export const Form = styled.form`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  height: 40px;
  padding: 0 ${theme.space.xs} 0 ${theme.space.sm};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.secondary};

  &:focus-within {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }
`;

export const Glyph = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

export const Input = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  background: none;
  color: ${theme.foreground.primary};
  font-size: 1rem;

  &::placeholder {
    color: ${theme.foreground.secondary};
  }

  &:focus {
    outline: none;
  }
`;

export const Clear = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: none;
  color: ${theme.foreground.secondary};
  cursor: pointer;

  &:hover {
    color: ${theme.foreground.primary};
  }
`;
