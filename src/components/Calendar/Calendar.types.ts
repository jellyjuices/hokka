export type CalendarProps = {
  selected: Date | null;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
};

export type DateVariant = "outlined" | "secondary" | "ghost";

export type DateDisplay = "full" | "dayMonth";

export type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  variant?: DateVariant;
  display?: DateDisplay;
};
