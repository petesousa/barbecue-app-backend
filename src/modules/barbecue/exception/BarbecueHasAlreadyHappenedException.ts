import BarbecueException from './BarbecueException';

class BarbecueHasAlreadyHappenedException extends BarbecueException {
  public readonly message: string = 'Barbecue has already happened.';

  public readonly statusCode: number = 400;
}

export default BarbecueHasAlreadyHappenedException;
