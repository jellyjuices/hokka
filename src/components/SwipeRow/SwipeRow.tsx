"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/src/components/Icon";
import { useMediaQuery, useSwipeAction } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";
import * as styles from "./SwipeRow.styles";
import type { SwipeRowProps } from "./SwipeRow.types";

const ACTION_WIDTH = 88;
const NARROW_QUERY = `(max-width: ${breakpoints.smTablet}px)`;

export function SwipeRow({
  actionIcon,
  actionLabel,
  onAction,
  isEnabled = true,
  children,
}: SwipeRowProps) {
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const { rootRef, isDragging, close, onPointerDown, onPointerMove, onPointerEnd } = useSwipeAction(
    { actionWidth: ACTION_WIDTH, onCommit: onAction, isEnabled: isEnabled && isNarrow },
  );

  function handleAction() {
    close();
    onAction();
  }

  return (
    <styles.Root
      ref={rootRef}
      style={{ "--swipe-action-width": `${ACTION_WIDTH}px` } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <styles.Action type="button" tabIndex={-1} aria-hidden onClick={handleAction}>
        <Icon name={actionIcon} size={22} />
        {actionLabel}
      </styles.Action>
      <styles.Surface $isDragging={isDragging}>{children}</styles.Surface>
    </styles.Root>
  );
}
