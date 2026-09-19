"use client";

import { Icon } from "@/src/components/Icon";
import { Select } from "@/src/components/Select";
import { CATEGORIES } from "@/src/data/categories";
import type { TransactionDirection } from "@/src/data/domain.types";
import { ANY, NO_FILTER, isFiltered } from "@/src/lib/filters";
import { RangeFilter } from "./_components/RangeFilter";
import {
  FilterBar,
  FilterCount,
  FilterReset,
  FilterSegment,
  FilterSegments,
  FilterSpacer,
} from "./TransactionFilters.styles";
import type { TransactionFiltersProps } from "./TransactionFilters.types";

const ALL = "all";

const SEGMENTS: { value: TransactionDirection | typeof ANY; label: string }[] = [
  { value: ANY, label: "All" },
  { value: "income", label: "Invoices" },
  { value: "expense", label: "Expenses" },
];

export function TransactionFilters({
  filter,
  resultCount,
  onChange,
  action,
}: TransactionFiltersProps) {
  const categoryOptions = [
    { value: ALL, label: "All categories" },
    ...CATEGORIES.map((category) => ({ value: category.id, label: category.label })),
  ];

  return (
    <FilterBar>
      <FilterSegments role="radiogroup" aria-label="Transaction type">
        {SEGMENTS.map((segment) => (
          <FilterSegment
            key={segment.label}
            type="button"
            role="radio"
            aria-checked={filter.direction === segment.value}
            $isSelected={filter.direction === segment.value}
            onClick={() => onChange({ ...filter, direction: segment.value })}
          >
            {segment.label}
          </FilterSegment>
        ))}
      </FilterSegments>
      <Select
        label="Category"
        placeholder="All categories"
        value={filter.category}
        options={categoryOptions}
        onChange={(value) => onChange({ ...filter, category: value === ALL ? ANY : value })}
      />
      <RangeFilter range={filter.range} onChange={(range) => onChange({ ...filter, range })} />
      <FilterSpacer />
      <FilterCount>
        <Icon name="filter" size={16} />
        {`${resultCount} shown`}
      </FilterCount>
      {isFiltered(filter) && (
        <FilterReset type="button" onClick={() => onChange(NO_FILTER)}>
          <Icon name="close" size={14} />
          Clear
        </FilterReset>
      )}
      {action}
    </FilterBar>
  );
}
