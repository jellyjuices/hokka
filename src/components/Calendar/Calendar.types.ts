export type CalendarProps = {
  selected: Date | null;
  month: Date;
  onMonthChange: (month: Date) => void;
  onSelect: (date: Date) => void;
};

export type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
};
