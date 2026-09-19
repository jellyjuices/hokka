"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Icon } from "@/src/components/Icon";
import { formatDate } from "@/src/lib/format";
import * as styles from "./Calendar.styles";
import type { CalendarProps, DatePickerProps } from "./Calendar.types";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" });

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
    <styles.Root>
      <styles.Header>
        <styles.NavButton
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <Icon name="caretLeft" size={16} />
        </styles.NavButton>
        <styles.MonthLabel>{MONTH_FORMATTER.format(month)}</styles.MonthLabel>
        <styles.NavButton
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <Icon name="caretRight" size={16} />
        </styles.NavButton>
      </styles.Header>
      <styles.Weekdays>
        {WEEKDAY_LABELS.map((label) => (
          <styles.Weekday key={label}>{label}</styles.Weekday>
        ))}
      </styles.Weekdays>
      <styles.Days>
        {days.map((day) => (
          <styles.Day
            key={toIsoDate(day)}
            type="button"
            $muted={day.getMonth() !== month.getMonth()}
            $selected={selected !== null && isSameDay(day, selected)}
            $today={isSameDay(day, today)}
            onClick={() => onSelect(day)}
          >
            {day.getDate()}
          </styles.Day>
        ))}
      </styles.Days>
    </styles.Root>
  );
}

export function DatePicker({
  id,
  name,
  defaultValue,
  placeholder = "Select a date",
}: DatePickerProps) {
  const initial = defaultValue ? fromIsoDate(defaultValue) : null;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(initial);
  const [month, setMonth] = useState<Date>(initial ?? new Date());

  function handleSelect(date: Date) {
    setSelected(date);
    setMonth(date);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <styles.Trigger id={id} type="button">
          <Icon name="calendar" size={16} />
          {selected ? formatDate(toIsoDate(selected)) : placeholder}
        </styles.Trigger>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content asChild sideOffset={8} align="start">
          <styles.Content>
            <Calendar
              selected={selected}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
            />
          </styles.Content>
        </Popover.Content>
      </Popover.Portal>
      <input type="hidden" name={name} value={selected ? toIsoDate(selected) : ""} />
    </Popover.Root>
  );
}
