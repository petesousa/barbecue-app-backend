import BarbecueException from './BarbecueException';

class BarbecueRSVPDoesNotExistException extends BarbecueException {
  public readonly message: string = 'Barbecue RSVP does not exist.';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPDoesNotExistException;
