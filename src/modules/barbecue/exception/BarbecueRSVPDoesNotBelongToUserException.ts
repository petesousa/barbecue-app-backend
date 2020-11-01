import BarbecueException from './BarbecueException';

class BarbecueRSVPDoesNotBelongToUserException extends BarbecueException {
  public readonly message: string =
    'Barbecue RSVP does not belong to this user.';

  public readonly statusCode: number = 403;
}

export default BarbecueRSVPDoesNotBelongToUserException;
