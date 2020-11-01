import { addHours, isBefore, isValid, startOfDay } from 'date-fns';
import DateProvider from '../model/DateProvider';

class MockDateProvider implements DateProvider {
  public getDateObj(date: Date): Date {
    return startOfDay(addHours(date, 3));
  }

  public isDateValid(date: Date): boolean {
    return isValid(date);
  }

  public isDateInThePast(date: Date): boolean {
    return isBefore(startOfDay(new Date(date)), startOfDay(new Date()));
  }
}

export default MockDateProvider;
