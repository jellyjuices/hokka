"use client";

import styled from "@emotion/styled";
import Image from "next/image";
import { theme, hoverFill } from "@/src/lib/theme";

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${theme.space.md};
`;

export const GalleryTile = styled.figure`
  position: relative;
  display: grid;
  place-items: center;
  margin: 0;
  aspect-ratio: 1;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.surface.secondary};
  color: ${theme.foreground.secondary};
  overflow: hidden;
`;

export const GalleryImage = styled(Image)`
  object-fit: cover;
`;

export const GalleryRemove = styled.button`
  position: absolute;
  top: ${theme.space.sm};
  right: ${theme.space.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.surface.primary};
  color: ${theme.foreground.primary};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill(theme.surface.primary)};
    color: ${theme.foreground.accent};
  }
`;

export const GalleryAdd = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.space.sm};
  aspect-ratio: 1;
  border: 1px dashed ${theme.surface.tint};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  color: ${theme.foreground.secondary};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;
  transition: background ${theme.motion.fast} ease;

  &:hover {
    background: ${hoverFill("transparent")};
    color: ${theme.foreground.accent};
  }
`;

export const GalleryFileInput = styled.input`
  display: none;
`;
