import { SkeletonItems, SkeletonRow } from "./Skeleton.styles";
import type { SkeletonListProps } from "./Skeleton.types";

export function SkeletonList({ label, rows = 3, rowHeight = 64 }: SkeletonListProps) {
  return (
    <SkeletonItems aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }, (_, index) => (
        <li key={index}>
          <SkeletonRow $height={rowHeight} />
        </li>
      ))}
    </SkeletonItems>
  );
}
