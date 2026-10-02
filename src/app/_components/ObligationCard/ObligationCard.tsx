"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatedNumber } from "@/src/components/AnimatedNumber";
import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { formatCurrency } from "@/src/lib/money";
import { ObligationAction, ObligationActions, ObligationLink } from "./ObligationCard.styles";
import type { ObligationCardProps } from "./ObligationCard.types";

const VARIANTS = {
  collecting: "primary",
  claimable: "primary",
  collected: "secondary",
} as const;

export function ObligationCard({ obligation }: ObligationCardProps) {
  const { label, amount, caption, icon, state, filingHref, historyHref } = obligation;
  const router = useRouter();

  function handleFile() {
    if (filingHref === null) return;
    router.push(filingHref);
  }

  return (
    <StatTile
      variant={VARIANTS[state]}
      size="compact"
      icon={icon}
      label={label}
      value={<AnimatedNumber value={amount} format={formatCurrency} />}
      caption={caption}
      badge={
        (filingHref !== null || historyHref !== null) && (
          <ObligationActions>
            {filingHref !== null && (
              <ObligationAction type="button" onClick={handleFile} aria-label={`File ${label}`}>
                <Icon name={CheckIcon} size={18} weight="bold" />
              </ObligationAction>
            )}
            {historyHref !== null && (
              <ObligationLink href={historyHref} aria-label={`${label} history`}>
                <Icon name={ArrowUpRightIcon} size={18} weight="bold" />
              </ObligationLink>
            )}
          </ObligationActions>
        )
      }
    />
  );
}
