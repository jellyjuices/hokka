"use client";

import { useState } from "react";
import { useMediaQuery } from "@/src/hooks";
import { breakpoints } from "@/src/lib/breakpoints";

const NARROW_QUERY = `(max-width: ${breakpoints.smTablet}px)`;

// One open flag drives both surfaces, so a picker opened on a phone that rotates wide
// hands over to its popover rather than leaving a stray screen up.
export function useTakeover() {
  const isNarrow = useMediaQuery(NARROW_QUERY);
  const [isOpen, setIsOpen] = useState(false);
  return {
    isPopoverOpen: isOpen && !isNarrow,
    isTakeoverOpen: isOpen && isNarrow,
    setIsOpen,
  };
}
