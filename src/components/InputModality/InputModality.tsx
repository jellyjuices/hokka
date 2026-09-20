"use client";

import { useEffect } from "react";

export function InputModality() {
  useEffect(() => {
    const setModality = (modality: "mouse" | "keyboard") => () => {
      document.documentElement.dataset.inputModality = modality;
    };
    const onPointer = setModality("mouse");
    const onKey = setModality("keyboard");
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  return null;
}
