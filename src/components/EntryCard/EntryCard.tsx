"use client";

import { useState } from "react";
import { Icon } from "@/src/components/Icon";
import { Menu } from "@/src/components/Menu";
import { useLongPress } from "@/src/hooks";
import {
  CardAction,
  CardAmount,
  CardBody,
  CardDetail,
  CardGlyph,
  CardLink,
  CardRow,
  CardShell,
  CardTitle,
} from "./EntryCard.styles";
import type { EntryCardProps } from "./EntryCard.types";

export function EntryCard({
  icon,
  color,
  date,
  detail,
  title,
  amount,
  isIncome = false,
  href,
  menuLabel,
  menuItems,
}: EntryCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasMenu = menuItems.length > 0;
  const longPress = useLongPress(() => {
    if (hasMenu) setIsMenuOpen(true);
  });

  return (
    <CardShell {...longPress}>
      <CardGlyph $color={color} aria-hidden="true">
        <Icon name={icon} size={22} weight="fill" />
      </CardGlyph>
      <CardBody>
        <CardRow>
          <CardDetail>{date}</CardDetail>
          {detail && <CardDetail>{detail}</CardDetail>}
        </CardRow>
        <CardRow>
          <CardTitle>
            {href === undefined ? title : <CardLink href={href}>{title}</CardLink>}
          </CardTitle>
          <CardAmount $isIncome={isIncome}>{amount}</CardAmount>
        </CardRow>
      </CardBody>
      {hasMenu && (
        <CardAction>
          <Menu
            label={menuLabel}
            items={menuItems}
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
          />
        </CardAction>
      )}
    </CardShell>
  );
}
