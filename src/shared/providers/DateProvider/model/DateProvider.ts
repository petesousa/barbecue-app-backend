export default interface DateProvider {
  getDateObj(date: Date): Date;
  isDateValid(date: Date): boolean;
  isDateInThePast(date: Date): boolean;
}
