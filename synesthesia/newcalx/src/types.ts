export interface CabinRates {
  [key: string]: number;
}

export interface Week {
  date: Date;
  isSelected: boolean;
  isFirstWeek: boolean;
  isLastWeek: boolean;
}