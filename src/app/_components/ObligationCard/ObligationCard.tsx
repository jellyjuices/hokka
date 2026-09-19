"use client";

import { Icon } from "@/src/components/Icon";
import { StatTile } from "@/src/components/StatTile";
import { SwipeRow } from "@/src/components/SwipeRow";
import { ObligationAction } from "./ObligationCard.styles";
import type { ObligationCardProps } from "./ObligationCard.types";

const TONES = {
  collecting: "accentSoft",
  claimable: "accent",
  collected: "neutral",
} as const;

export function ObligationCard({ obligation, onToggle }: ObligationCardProps) {
  const { id, label, value, caption, icon, state } = obligation;
  const isCollected = state === "collected";
  const isActionable = state !== "collecting";
  const actionIcon = isCollected ? "undo" : "check";
  const actionName = isCollected ? `Reopen ${label}` : `Mark ${label} as filed`;

  function handleToggle() {
    onToggle(id);
  }

  return (
    <SwipeRow
      actionIcon={actionIcon}
      actionLabel={isCollected ? "Reopen" : "File"}
      onAction={handleToggle}
      isEnabled={isActionable}
    >
      <StatTile
        tone={TONES[state]}
        size="compact"
        icon={icon}
        label={label}
        value={value}
        caption={caption}
        badge={
          isActionable && (
            <ObligationAction type="button" onClick={handleToggle} aria-label={actionName}>
              <Icon name={actionIcon} size={18} weight="bold" />
            </ObligationAction>
          )
        }
      />
    </SwipeRow>
  );
}
