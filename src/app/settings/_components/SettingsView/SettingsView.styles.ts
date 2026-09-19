"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const SettingsStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
  padding-bottom: ${theme.space.xl};
`;

// The unit sits beside the value rather than in the label, so the tile reads
// "HST rate … 13%". The input keeps its right alignment and the suffix hugs it.
export const TileMeasure = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: baseline;
  justify-content: flex-end;
  min-width: 0;
`;

// The glyph is drawn, the word is announced: a screen reader reads "percent"
// where the eye sees "%", now that the label no longer carries the unit.
export const TileUnit = styled.span`
  flex: 0 0 auto;
  color: ${theme.foreground.primary};
  font-size: 0;

  &::after {
    content: "%";
    font-size: ${theme.fontSize.md};
  }
`;
