import {
  addHours,
  getDate,
  getDaysInMonth,
  isBefore,
  isValid,
  startOfDay,
} from 'date-fns';
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

  public daysInMonth(year: number, month: number): number {
    return getDaysInMonth(new Date(year, month - 1));
  }

  public daysInMonthArray(daysInMonth: number): number[] {
    return Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    );
  }

  public isTheSameDay(date: Date, day: number): boolean {
    const dateUTC = this.getDateObj(new Date(date));
    const dateDay = getDate(dateUTC);
    return dateDay === day;
  }
}

export default MockDateProvider;
