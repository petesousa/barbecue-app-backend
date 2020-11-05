import BarbecueException from './BarbecueException';

class DateIsAlreadyBookedException extends BarbecueException {
  public readonly message: string = 'Nessa data já tem churras';

  public readonly statusCode: number = 400;
}

export default DateIsAlreadyBookedException;
