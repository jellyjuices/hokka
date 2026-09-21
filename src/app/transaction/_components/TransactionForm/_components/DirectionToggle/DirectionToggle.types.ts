import type { TransactionDirection } from "@/src/data/domain.types";

export type DirectionToggleProps = {
  value: TransactionDirection;
  onChange: (direction: TransactionDirection) => void;
};
