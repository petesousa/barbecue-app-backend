import { addHours, isBefore, isValid, startOfDay } from 'date-fns';
import DateProvider from '../model/DateProvider';

class DefaultDateProvider implements DateProvider {
  public getDateObj(date: Date): Date {
    return startOfDay(addHours(date, 3));
  }

  public isDateValid(date: Date): boolean {
    return isValid(date);
  }

  public isDateInThePast(input: Date): boolean {
    const date = this.getDateObj(new Date(input));
    const today = this.getDateObj(new Date());
    return isBefore(date, today);
  }
}

export default DefaultDateProvider;
