"use client";

import { DotsRow, PageDot } from "./PageDots.styles";
import type { PageDotsProps } from "./PageDots.types";

export function PageDots({ count, activeIndex, label, onSelect, getSlideLabel }: PageDotsProps) {
  return (
    <DotsRow role="group" aria-label={label}>
      {Array.from({ length: count }, (item, index) => (
        <PageDot
          key={getSlideLabel(index)}
          type="button"
          $isActive={index === activeIndex}
          aria-label={getSlideLabel(index)}
          aria-current={index === activeIndex ? "true" : undefined}
          onClick={() => onSelect(index)}
        />
      ))}
    </DotsRow>
  );
}
