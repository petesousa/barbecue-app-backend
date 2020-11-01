import BarbecueException from './BarbecueException';

class BarbecueRSVPIsPaidForException extends BarbecueException {
  public readonly message: string = 'RSVP Is already paid for.';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPIsPaidForException;
