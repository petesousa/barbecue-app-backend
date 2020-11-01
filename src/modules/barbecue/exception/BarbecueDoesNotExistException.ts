import BarbecueException from './BarbecueException';

class BarbecueDoesNotExistException extends BarbecueException {
  public readonly message: string = 'Barbecue does not exist.';

  public readonly statusCode: number = 400;
}

export default BarbecueDoesNotExistException;
