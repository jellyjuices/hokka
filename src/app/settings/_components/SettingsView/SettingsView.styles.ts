"use client";

import styled from "@emotion/styled";
import { theme } from "@/src/lib/theme";

export const SettingsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
  padding-bottom: ${theme.space.xl};
`;

export const SettingsStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`;

export const SettingsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
  padding-top: ${theme.space.md};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  padding: 0;
  color: ${theme.foreground.primary};
  font-family: ${theme.fontFamily.display};
  font-size: ${theme.fontSize.lg};
  font-weight: 400;
`;

export const SectionNote = styled.p`
  margin: 0 0 ${theme.space.xs};
  padding: 0 ${theme.space.lg};
  color: ${theme.foreground.disabled};
  font-size: ${theme.fontSize.xs};
  line-height: 1.4;
`;
