"use client";

import * as Popover from "@radix-ui/react-popover";
import { Icon } from "@/src/components/Icon";
import { CheckIcon, FunnelSimpleIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/src/data/categories";
import type { TransactionDirection } from "@/src/data/domain.types";
import { ANY, NO_FILTER, isFiltered } from "@/src/lib/filters";
import type { TransactionFilter } from "@/src/lib/filters";
import { isRangeSet } from "@/src/lib/ranges";
import { RangeFilter } from "./_components/RangeFilter";
import {
  FilterBadge,
  FilterBar,
  FilterCheck,
  FilterCheckBox,
  FilterChecks,
  FilterGroup,
  FilterGroupLabel,
  FilterPanel,
  FilterReset,
  FilterSegment,
  FilterSegments,
  FilterSpacer,
  FilterTrigger,
} from "./TransactionFilters.styles";
import type { TransactionFiltersProps } from "./TransactionFilters.types";

const SEGMENTS: { value: TransactionDirection | typeof ANY; label: string }[] = [
  { value: ANY, label: "All" },
  { value: "income", label: "Invoices" },
  { value: "expense", label: "Expenses" },
];

function activeCount(filter: TransactionFilter) {
  return [filter.categories.length > 0, isRangeSet(filter.range)].filter(Boolean).length;
}

export function TransactionFilters({ filter, onChange, action }: TransactionFiltersProps) {
  function toggleCategory(categoryId: string) {
    const categories = filter.categories.includes(categoryId)
      ? filter.categories.filter((id) => id !== categoryId)
      : [...filter.categories, categoryId];
    onChange({ ...filter, categories });
  }

  const count = activeCount(filter);

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
      <Popover.Root>
        <FilterTrigger
          type="button"
          aria-label={count === 0 ? "Filters" : `Filters, ${count} active`}
          $isActive={count > 0}
        >
          <Icon name={FunnelSimpleIcon} size={20} />
          {count > 0 && <FilterBadge aria-hidden="true">{count}</FilterBadge>}
        </FilterTrigger>
        <Popover.Portal>
          <FilterPanel align="start" sideOffset={6}>
            <FilterGroup>
              <FilterGroupLabel id="filter-categories">Categories</FilterGroupLabel>
              <FilterChecks role="group" aria-labelledby="filter-categories">
                {CATEGORIES.map((category) => {
                  const isChecked = filter.categories.includes(category.id);
                  return (
                    <FilterCheck
                      key={category.id}
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <FilterCheckBox $isChecked={isChecked} aria-hidden="true">
                        {isChecked && <Icon name={CheckIcon} size={12} weight="bold" />}
                      </FilterCheckBox>
                      {category.label}
                    </FilterCheck>
                  );
                })}
              </FilterChecks>
            </FilterGroup>
            <FilterGroup>
              <FilterGroupLabel>Date range</FilterGroupLabel>
              <RangeFilter
                range={filter.range}
                onChange={(range) => onChange({ ...filter, range })}
              />
            </FilterGroup>
          </FilterPanel>
        </Popover.Portal>
      </Popover.Root>
      <FilterSpacer />
      {isFiltered(filter) && (
        <FilterReset type="button" onClick={() => onChange(NO_FILTER)}>
          <Icon name={XIcon} size={14} />
          Clear
        </FilterReset>
      )}
      {action}
    </FilterBar>
  );
}
