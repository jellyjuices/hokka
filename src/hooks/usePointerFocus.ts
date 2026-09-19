"use client";

import { useCallback, useEffect, useState } from "react";

let modality: "pointer" | "keyboard" = "keyboard";
let subscribers = 0;

function notePointer() {
  modality = "pointer";
}

function noteKeyboard() {
  modality = "keyboard";
}

export function usePointerFocus() {
  const [isPointerFocused, setIsPointerFocused] = useState(false);

  useEffect(() => {
    if (subscribers === 0) {
      document.addEventListener("pointerdown", notePointer, true);
      document.addEventListener("keydown", noteKeyboard, true);
    }
    subscribers += 1;

    return () => {
      subscribers -= 1;
      if (subscribers > 0) return;
      document.removeEventListener("pointerdown", notePointer, true);
      document.removeEventListener("keydown", noteKeyboard, true);
    };
  }, []);

  const onFocus = useCallback(() => setIsPointerFocused(modality === "pointer"), []);
  const onBlur = useCallback(() => setIsPointerFocused(false), []);

  return {
    onFocus,
    onBlur,
    "data-pointer-focus": isPointerFocused ? "" : undefined,
  };
}
