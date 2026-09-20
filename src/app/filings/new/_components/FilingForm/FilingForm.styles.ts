"use client";

import styled from "@emotion/styled";
import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
  padding-bottom: ${theme.space.lg};
`;

export const NoteField = styled(Input)`
  align-items: flex-start;
  padding: ${theme.space.lg};
`;

export const PairRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.space.md};

  ${mediaDown("mobile")} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FormNotice = styled.p`
  margin: 0;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.accentSecondary};
  color: ${theme.foreground.accent};
  font-size: ${theme.fontSize.sm};
`;

export const SubmitRow = styled.div`
  display: flex;
  padding-top: ${theme.space.md};
`;

export const SubmitButton = styled(Button)`
  min-width: 290px;

  ${mediaDown("mobile")} {
    min-width: 0;
    width: 100%;
  }
`;
