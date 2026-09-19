export type CalendarProps = {
  selected: Date | null;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
};

export type DateTone = "outline" | "soft";

export type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  tone?: DateTone;
};
