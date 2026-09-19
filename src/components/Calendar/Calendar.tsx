"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "@/src/components/Icon";
import { usePointerFocus } from "@/src/hooks";
import { formatDate } from "@/src/lib/dates";
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
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" });
const DAY_MONTH_FORMATTER = new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric" });

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// A recurring date — a fiscal year start — is the same day every year, so its
// label drops the year and never says "Today": both would read as a one-off.
function dateLabel(date: Date, display: DateDisplay) {
  if (display === "dayMonth") return DAY_MONTH_FORMATTER.format(date);
  return isSameDay(date, new Date()) ? "Today" : formatDate(toIsoDate(date));
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
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
  const today = new Date();

  return (
    <CalendarPanel>
      <CalendarHeader>
        <CalendarNavButton
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <Icon name="caretLeft" size={16} />
        </CalendarNavButton>
        <CalendarMonthLabel>{MONTH_FORMATTER.format(month)}</CalendarMonthLabel>
        <CalendarNavButton
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <Icon name="caretRight" size={16} />
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
  tone = "outline",
  display = "full",
}: DatePickerProps) {
  const initial = defaultValue ? fromIsoDate(defaultValue) : null;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Date | null>(initial);
  const selected = value === undefined ? internal : value === "" ? null : fromIsoDate(value);
  const [month, setMonth] = useState<Date>(selected ?? new Date());
  const pointerFocus = usePointerFocus();

  function handleOpenChange(next: boolean) {
    if (next) setMonth(selected ?? new Date());
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
        <CalendarTrigger id={id} type="button" $tone={tone} {...pointerFocus}>
          {tone === "outline" ? (
            <>
              <Icon name="calendar" size={16} />
              {label}
            </>
          ) : (
            <>
              {label}
              <Icon name="calendar" size={20} />
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
