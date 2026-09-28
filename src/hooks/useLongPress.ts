"use client";

import { useEffect, useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

const HOLD_MS = 500;
const MOVE_TOLERANCE = 10;

// React bubbles events out of a portal along the component tree, so a tap inside a menu or dialog
// opened from the element would otherwise arm the hold or eat the click.
function isOutside(event: MouseEvent | PointerEvent) {
  return !event.currentTarget.contains(event.target as Node);
}

export function useLongPress(onLongPress: () => void) {
  const timer = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const didFire = useRef(false);
  const pointerType = useRef("");

  function cancel() {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
  }

  function fire() {
    cancel();
    didFire.current = true;
    onLongPress();
  }

  useEffect(() => cancel, []);

  return {
    onPointerDown(event: PointerEvent) {
      if (isOutside(event)) return;
      didFire.current = false;
      pointerType.current = event.pointerType;
      if (event.pointerType === "mouse") return;
      origin.current = { x: event.clientX, y: event.clientY };
      cancel();
      timer.current = window.setTimeout(fire, HOLD_MS);
    },
    onPointerMove(event: PointerEvent) {
      const dx = event.clientX - origin.current.x;
      const dy = event.clientY - origin.current.y;
      if (Math.hypot(dx, dy) > MOVE_TOLERANCE) cancel();
    },
    onPointerUp: cancel,
    onPointerCancel: cancel,
    // Android raises contextmenu on a held touch; iOS never does, hence the timer as well.
    onContextMenu(event: MouseEvent) {
      if (pointerType.current === "mouse" || isOutside(event)) return;
      event.preventDefault();
      if (!didFire.current) fire();
    },
    // A held touch still ends in a click; swallow it so the card link does not navigate.
    onClickCapture(event: MouseEvent) {
      if (!didFire.current || isOutside(event)) return;
      didFire.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
