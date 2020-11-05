import BarbecueException from './BarbecueException';

class BarbecueRSVPDoesNotExistException extends BarbecueException {
  public readonly message: string = 'Confirmação não existe.';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPDoesNotExistException;
