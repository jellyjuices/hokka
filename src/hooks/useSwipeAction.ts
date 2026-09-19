"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

export type SwipeActionOptions = {
  actionWidth: number;
  onCommit: () => void;
  isEnabled?: boolean;
};

export type SwipeActionState = {
  rootRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  isDragging: boolean;
  close: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

type Axis = "undecided" | "horizontal" | "vertical";

const AXIS_LOCK_PX = 8;
const OPEN_RATIO = 0.45;
const COMMIT_RATIO = 1.18;
const RUBBER_BAND = 0.35;

function resist(distance: number, limit: number) {
  if (distance <= limit) return distance;
  return limit + (distance - limit) * RUBBER_BAND;
}

export function useSwipeAction({
  actionWidth,
  onCommit,
  isEnabled = true,
}: SwipeActionOptions): SwipeActionState {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const gestureRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    base: 0,
    axis: "undecided" as Axis,
  });

  const paint = useCallback((offset: number) => {
    rootRef.current?.style.setProperty("--swipe-x", `${offset}px`);
  }, []);

  const settle = useCallback(
    (shouldOpen: boolean) => {
      setIsOpen(shouldOpen);
      paint(shouldOpen ? -actionWidth : 0);
    },
    [actionWidth, paint],
  );

  const close = useCallback(() => settle(false), [settle]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isEnabled || event.pointerType === "mouse" || !event.isPrimary) return;
      gestureRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        base: isOpen ? -actionWidth : 0,
        axis: "undecided",
      };
    },
    [actionWidth, isEnabled, isOpen],
  );

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

      const travel = gesture.base + dx;
      paint(travel >= 0 ? 0 : -resist(-travel, actionWidth));
    },
    [actionWidth, paint],
  );

  const onPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const gesture = gestureRef.current;
      if (gesture.pointerId !== event.pointerId) return;
      gesture.pointerId = -1;

      if (gesture.axis !== "horizontal") return;
      setIsDragging(false);

      const travel = -(gesture.base + (event.clientX - gesture.startX));
      if (travel >= actionWidth * COMMIT_RATIO) {
        settle(false);
        onCommit();
        return;
      }
      settle(travel >= actionWidth * OPEN_RATIO);
    },
    [actionWidth, onCommit, settle],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && rootRef.current?.contains(target)) return;
      close();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, close]);

  return { rootRef, isOpen, isDragging, close, onPointerDown, onPointerMove, onPointerEnd };
}
