export type PageDotsProps = {
  count: number;
  activeIndex: number;
  label: string;
  onSelect: (index: number) => void;
  getSlideLabel: (index: number) => string;
};
