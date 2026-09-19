"use client";

import { Icon } from "@/src/components/Icon";
import { useMediaQuery, useSwipeAction } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";
import { SWIPE_ACTION_WIDTH, SwipeAction, SwipeFrame, SwipeSurface } from "./SwipeRow.styles";
import type { SwipeRowProps } from "./SwipeRow.types";

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
    { actionWidth: SWIPE_ACTION_WIDTH, onCommit: onAction, isEnabled: isEnabled && isNarrow },
  );

  function handleAction() {
    close();
    onAction();
  }

  return (
    <SwipeFrame
      ref={rootRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <SwipeAction type="button" tabIndex={-1} aria-hidden onClick={handleAction}>
        <Icon name={actionIcon} size={22} />
        {actionLabel}
      </SwipeAction>
      <SwipeSurface $isDragging={isDragging}>{children}</SwipeSurface>
    </SwipeFrame>
  );
}
