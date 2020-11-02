import BarbecueException from './BarbecueException';

class BeforeStartOfTimeException extends BarbecueException {
  public readonly message: string = 'There are no events before the year 2020.';

  public readonly statusCode: number = 400;
}

export default BeforeStartOfTimeException;
