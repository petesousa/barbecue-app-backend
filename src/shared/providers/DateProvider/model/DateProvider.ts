export default interface DateProvider {
  getDateObj(date: Date): Date;
  isDateValid(date: Date): boolean;
  isDateInThePast(date: Date): boolean;
  daysInMonth(year: number, month: number): number;
  daysInMonthArray(daysInMonth: number): number[];
  isTheSameDay(date: Date, day: number): boolean;
}
