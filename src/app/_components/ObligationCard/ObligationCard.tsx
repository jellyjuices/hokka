"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatedNumber } from "@/src/components/AnimatedNumber";
import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { formatCurrency } from "@/src/lib/money";
import { ObligationArrow, ObligationLink } from "./ObligationCard.styles";
import type { ObligationCardProps } from "./ObligationCard.types";

const VARIANTS = {
  collecting: "primary",
  claimable: "primary",
  collected: "secondary",
} as const;

export function ObligationCard({ obligation }: ObligationCardProps) {
  const { label, amount, caption, icon, state, href } = obligation;

  return (
    <ObligationLink href={href} aria-label={`${label}, ${formatCurrency(amount)}`}>
      <StatTile
        variant={VARIANTS[state]}
        size="compact"
        icon={icon}
        label={label}
        value={<AnimatedNumber value={amount} format={formatCurrency} />}
        caption={caption}
        badge={
          <ObligationArrow aria-hidden data-obligation-arrow>
            <Icon name={ArrowUpRightIcon} size={18} weight="bold" />
          </ObligationArrow>
        }
      />
    </ObligationLink>
  );
}
