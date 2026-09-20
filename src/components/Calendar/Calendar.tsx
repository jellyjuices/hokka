"use client";

import { useState } from "react";
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "@/src/components/Icon";
import { usePointerFocus } from "@/src/hooks";
import {
  formatDate,
  formatDayAndMonth,
  formatMonthAndYear,
  isSameDay,
  parseIsoDate,
  toIsoDate,
  todayDate,
} from "@/src/lib/dates";
import {
  CalendarDay,
  CalendarDays,
  CalendarHeader,
  CalendarMonthLabel,
  CalendarNavButton,
  CalendarPanel,
  CalendarPopover,
  CalendarTrigger,
  CalendarWeekday,
  CalendarWeekdays,
} from "./Calendar.styles";
import type { CalendarProps, DateDisplay, DatePickerProps } from "./Calendar.types";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function dateLabel(date: Date, display: DateDisplay) {
  const isoDate = toIsoDate(date);
  return display === "dayMonth" ? formatDayAndMonth(isoDate) : formatDate(isoDate);
}

function buildMonthGrid(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = new Date(year, monthIndex, 1).getDay();

  const days: Date[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(new Date(year, monthIndex, i - startOffset + 1));
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, monthIndex, day));
  }
  const trailing = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= trailing; day++) {
    days.push(new Date(year, monthIndex + 1, day));
  }
  return days;
}

export function Calendar({ selected, month, onMonthChange, onSelect }: CalendarProps) {
  const days = buildMonthGrid(month);
  const today = todayDate();

  return (
    <CalendarPanel>
      <CalendarHeader>
        <CalendarNavButton
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <Icon name={CaretLeftIcon} size={16} />
        </CalendarNavButton>
        <CalendarMonthLabel>{formatMonthAndYear(toIsoDate(month))}</CalendarMonthLabel>
        <CalendarNavButton
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <Icon name={CaretRightIcon} size={16} />
        </CalendarNavButton>
      </CalendarHeader>
      <CalendarWeekdays>
        {WEEKDAY_LABELS.map((label) => (
          <CalendarWeekday key={label}>{label}</CalendarWeekday>
        ))}
      </CalendarWeekdays>
      <CalendarDays>
        {days.map((day) => (
          <CalendarDay
            key={toIsoDate(day)}
            type="button"
            $muted={day.getMonth() !== month.getMonth()}
            $selected={selected !== null && isSameDay(day, selected)}
            $today={isSameDay(day, today)}
            onClick={() => onSelect(day)}
          >
            {day.getDate()}
          </CalendarDay>
        ))}
      </CalendarDays>
    </CalendarPanel>
  );
}

export function DatePicker({
  id,
  name,
  defaultValue,
  value,
  onChange,
  placeholder = "Select a date",
  variant = "outlined",
  display = "full",
}: DatePickerProps) {
  const initial = defaultValue ? parseIsoDate(defaultValue) : null;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Date | null>(initial);
  const selected = value === undefined ? internal : value === "" ? null : parseIsoDate(value);
  const [month, setMonth] = useState<Date>(selected ?? todayDate());
  const pointerFocus = usePointerFocus();

  function handleOpenChange(next: boolean) {
    if (next) setMonth(selected ?? todayDate());
    setOpen(next);
  }

  function handleSelect(date: Date) {
    setInternal(date);
    setMonth(date);
    setOpen(false);
    onChange?.(toIsoDate(date));
  }

  const label = selected === null ? placeholder : dateLabel(selected, display);

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <CalendarTrigger id={id} type="button" $variant={variant} {...pointerFocus}>
          {variant === "outlined" ? (
            <>
              <Icon name={CalendarBlankIcon} size={16} />
              {label}
            </>
          ) : (
            <>
              {label}
              <Icon name={CalendarBlankIcon} size={20} />
            </>
          )}
        </CalendarTrigger>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content asChild sideOffset={8} align="start">
          <CalendarPopover>
            <Calendar
              selected={selected}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </CalendarPopover>
        </Popover.Content>
      </Popover.Portal>
      <input type="hidden" name={name} value={selected ? toIsoDate(selected) : ""} />
    </Popover.Root>
  );
}
