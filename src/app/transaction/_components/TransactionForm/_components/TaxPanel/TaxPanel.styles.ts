"use client";

import styled from "@emotion/styled";
import { Input, InputShell } from "@/src/components/Input";
import { theme } from "@/src/lib/theme";
import { mediaDown } from "@/src/lib/breakpoints";

export const TaxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.sm};
`;

export const TaxRow = styled(InputShell)`
  justify-content: space-between;
`;

export const ModifierRow = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: ${theme.space.sm};

  ${mediaDown("mobile")} {
    grid-auto-flow: row;
  }
`;

export const ModifierField = styled(Input)`
  justify-content: space-between;
  font-weight: 500;
`;

export const ModifierShell = styled(InputShell)`
  justify-content: space-between;
  font-weight: 500;
`;
