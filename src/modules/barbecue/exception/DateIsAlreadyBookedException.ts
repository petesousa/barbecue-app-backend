import BarbecueException from './BarbecueException';

class DateIsAlreadyBookedException extends BarbecueException {
  public readonly message: string = 'Date is already booked.';

  public readonly statusCode: number = 400;
}

export default DateIsAlreadyBookedException;
