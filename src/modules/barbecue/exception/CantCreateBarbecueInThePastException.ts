import BarbecueException from './BarbecueException';

class CantCreateBarbecueInThePastException extends BarbecueException {
  public readonly message: string =
    'Cannot create barbecue on a date in the past.';

  public readonly statusCode: number = 400;
}

export default CantCreateBarbecueInThePastException;
