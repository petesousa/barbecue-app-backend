import BarbecueException from './BarbecueException';

class BarbecueRSVPAlreadyExistsException extends BarbecueException {
  public readonly message: string = 'Presença já confirmada.';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPAlreadyExistsException;
