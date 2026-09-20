"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { theme, numeric } from "@/src/lib/theme";

// Every field in the app is a bare input inside a styled shell: the shell draws
// the box and owns the focus ring, the input itself draws nothing.
const bare = css`
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: ${theme.foreground.primary};

  &:focus-visible {
    outline: none;
  }
`;

const shell = css`
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 64px;
  padding: 0 ${theme.space.lg};
`;

export const softField = css`
  ${shell};
  gap: ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};

  &:has(:focus-visible) {
    outline: 2px solid ${theme.foreground.accent};
    outline-offset: 2px;
  }
`;

export const outlineField = css`
  ${shell};
  gap: ${theme.space.sm};
  border: 1px solid ${theme.surface.tint};
  border-radius: ${theme.borderRadius.full};
  color: ${theme.foreground.primary};

  &:has(:focus-visible) {
    border-color: ${theme.foreground.accent};
  }
`;

export const SoftField = styled.label`
  ${softField};
  cursor: text;
`;

export const OutlineField = styled.label`
  ${outlineField};
  cursor: text;
`;

export const TextInput = styled.input`
  ${bare};
  flex: 1 1 auto;
  font-size: ${theme.fontSize.md};

  &::placeholder {
    color: ${theme.foreground.secondary};
  }
`;

export const TextArea = styled.textarea`
  ${bare};
  flex: 1 1 auto;
  min-height: 72px;
  font-size: ${theme.fontSize.md};
  resize: none;

  &::placeholder {
    color: ${theme.foreground.secondary};
  }
`;

export const AmountInput = styled.input`
  ${bare};
  ${numeric};
  flex: 1 1 auto;
  text-align: right;
  font-size: ${theme.fontSize.md};

  &::placeholder {
    color: ${theme.foreground.disabled};
  }
`;

export const DisplayInput = styled.input`
  ${bare};
  flex: 1 1 auto;
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize["4xl"]};
  font-weight: 400;

  &::placeholder {
    color: ${theme.foreground.disabled};
  }
`;

// The field is only as wide as what is typed, so a prefix or suffix stays
// against the first digit instead of floating away from a short amount.
export const InputSizer = styled.span`
  ${numeric};
  display: inline-grid;
  min-width: 2.5rem;
  max-width: 100%;

  &::after {
    content: attr(data-value);
    grid-area: 1 / 1;
    padding-inline-end: 1px;
    visibility: hidden;
    white-space: pre;
  }
`;

export const SizedInput = styled(AmountInput)`
  grid-area: 1 / 1;
  width: 100%;
  max-width: 100%;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
`;

export const FileInput = styled.input`
  display: none;
`;
