"use client";

import styled from "@emotion/styled";
import { Input } from "@/src/components/Input";
import { theme, hoverFill } from "@/src/lib/theme";

export const SearchButton = styled.button`
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
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
  }

  &:focus-visible {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 3px;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
  height: 40px;
  padding: 0 ${theme.space.xs} 0 ${theme.space.sm};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.secondary};

  &:has(:focus-visible) {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }
`;

export const SearchField = styled(Input)`
  flex: 1 1 auto;
  gap: ${theme.space.sm};
`;

export const SearchClearButton = styled.button`
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
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.primary};
  }
`;
