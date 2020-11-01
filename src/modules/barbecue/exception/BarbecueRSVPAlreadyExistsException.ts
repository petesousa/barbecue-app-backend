import BarbecueException from './BarbecueException';

class BarbecueRSVPAlreadyExistsException extends BarbecueException {
  public readonly message: string = 'Barbecue RSVP already exists.';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPAlreadyExistsException;
