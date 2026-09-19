import type { Category } from "@/src/data/categories";

export type CategoryPickerProps = {
  value: string;
  categories: Category[];
  onChange: (categoryId: string) => void;
};
