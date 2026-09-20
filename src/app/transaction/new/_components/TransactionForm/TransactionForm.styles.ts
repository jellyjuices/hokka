"use client";

import styled from "@emotion/styled";
import { Button } from "@/src/components/Button";
import { DisplayInput } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.xl};
  padding-bottom: ${theme.space.lg};
`;

export const HeadRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "title attach"
    "category category";
  align-items: center;
  row-gap: ${theme.space.xl};
  column-gap: ${theme.space.md};

  ${mediaDown("smTablet")} {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      "title title"
      "category attach";
  }
`;

export const CategoryCell = styled.div`
  grid-area: category;
  display: flex;
  min-width: 0;
`;

export const AttachCell = styled.div`
  grid-area: attach;
  display: flex;
  justify-content: flex-end;

  ${mediaDown("smTablet")} {
    justify-content: flex-start;
  }
`;

export const TitleInput = styled(DisplayInput)`
  grid-area: title;
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
