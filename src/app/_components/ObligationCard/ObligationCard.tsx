"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { SwipeRow } from "@/src/components/SwipeRow";
import { ObligationAction } from "./ObligationCard.styles";
import type { ObligationCardProps } from "./ObligationCard.types";

const TONES = {
  collecting: "accent",
  claimable: "accent",
  collected: "neutral",
} as const;

export function ObligationCard({ obligation }: ObligationCardProps) {
  const { label, value, caption, icon, state, filingHref } = obligation;
  const router = useRouter();

  function handleFile() {
    if (filingHref === null) return;
    router.push(filingHref);
  }

  return (
    <SwipeRow
      actionIcon="check"
      actionLabel="File"
      onAction={handleFile}
      isEnabled={filingHref !== null}
    >
      <StatTile
        tone={TONES[state]}
        size="compact"
        icon={icon}
        label={label}
        value={value}
        caption={caption}
        badge={
          filingHref !== null && (
            <ObligationAction type="button" onClick={handleFile} aria-label={`File ${label}`}>
              <Icon name="check" size={18} weight="bold" />
            </ObligationAction>
          )
        }
      />
    </SwipeRow>
  );
}
