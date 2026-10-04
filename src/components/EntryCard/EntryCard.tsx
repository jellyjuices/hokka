"use client";

import { useState } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
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
  CardSpinner,
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
  isPending = false,
}: EntryCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasMenu = menuItems.length > 0;
  const isLinked = href !== undefined && !isPending;
  const longPress = useLongPress(() => {
    if (hasMenu && !isPending) setIsMenuOpen(true);
  });

  return (
    <CardShell {...longPress} $isPending={isPending} aria-busy={isPending}>
      <CardGlyph $color={color} aria-hidden="true">
        {isPending ? (
          <CardSpinner>
            <Icon name={CircleNotchIcon} size={22} weight="bold" />
          </CardSpinner>
        ) : (
          <Icon name={icon} size={22} weight="fill" />
        )}
      </CardGlyph>
      <CardBody>
        <CardRow>
          <CardDetail>{date}</CardDetail>
          {detail && <CardDetail>{detail}</CardDetail>}
        </CardRow>
        <CardRow>
          <CardTitle>{isLinked ? <CardLink href={href}>{title}</CardLink> : title}</CardTitle>
          <CardAmount $isIncome={isIncome}>{amount}</CardAmount>
        </CardRow>
      </CardBody>
      {hasMenu && (
        <CardAction inert={isPending}>
          <Menu
            label={menuLabel}
            items={menuItems}
            open={isMenuOpen && !isPending}
            onOpenChange={setIsMenuOpen}
          />
        </CardAction>
      )}
    </CardShell>
  );
}
