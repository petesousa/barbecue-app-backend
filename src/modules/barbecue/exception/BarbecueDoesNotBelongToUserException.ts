import BarbecueException from './BarbecueException';

class BarbecueDoesNotBelongToUserException extends BarbecueException {
  public readonly message: string = 'Barbecue does not belong to this user.';

  public readonly statusCode: number = 403;
}

export default BarbecueDoesNotBelongToUserException;
