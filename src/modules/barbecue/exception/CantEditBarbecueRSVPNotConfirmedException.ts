import BarbecueException from './BarbecueException';

class CantEditBarbecueRSVPNotConfirmedException extends BarbecueException {
  public readonly message: string = 'Cannot edit RSVP that is not confirmed.';

  public readonly statusCode: number = 400;
}

export default CantEditBarbecueRSVPNotConfirmedException;
