export type SelectChipOption = {
  value: string;
  label: string;
};

export type SelectChipProps = {
  label: string;
  value: string;
  placeholder: string;
  options: SelectChipOption[];
  onChange: (value: string) => void;
};
