import BarbecueException from './BarbecueException';

class CantEditBarbecueRSVPNotConfirmedException extends BarbecueException {
  public readonly message: string = 'Primeiro confirme sua presença.';

  public readonly statusCode: number = 400;
}

export default CantEditBarbecueRSVPNotConfirmedException;
