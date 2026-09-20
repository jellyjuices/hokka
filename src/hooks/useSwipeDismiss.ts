"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

export type SwipeDismissOptions = {
  onDismiss: () => void;
};

export type SwipeDismissState = {
  rootRef: RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

type Axis = "undecided" | "horizontal" | "vertical";

const AXIS_LOCK_PX = 8;
const COMMIT_PX = 72;
const FADE_PX = 180;

export function useSwipeDismiss({ onDismiss }: SwipeDismissOptions): SwipeDismissState {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const gestureRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    axis: "undecided" as Axis,
  });

  const paint = useCallback((offset: number) => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--toast-x", `${offset}px`);
    root.style.setProperty("--toast-fade", `${Math.max(0, 1 - Math.abs(offset) / FADE_PX)}`);
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: "undecided",
    };
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (gesture.pointerId !== event.pointerId || gesture.axis === "vertical") return;

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;

      if (gesture.axis === "undecided") {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          gesture.axis = "vertical";
          return;
        }
        gesture.axis = "horizontal";
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
      }

      paint(dx);
    },
    [paint],
  );

  const onPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (gesture.pointerId !== event.pointerId) return;
      gesture.pointerId = -1;

      if (gesture.axis !== "horizontal") return;
      setIsDragging(false);

      const travel = event.clientX - gesture.startX;
      if (Math.abs(travel) >= COMMIT_PX) {
        paint(Math.sign(travel) * FADE_PX);
        onDismiss();
        return;
      }
      paint(0);
    },
    [onDismiss, paint],
  );

  return { rootRef, isDragging, onPointerDown, onPointerMove, onPointerEnd };
}
