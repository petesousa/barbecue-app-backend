import BarbecueException from './BarbecueException';

class BarbecueRSVPDoesNotBelongToUserException extends BarbecueException {
  public readonly message: string =
    'Somente o usuário pode alterar sua confirmação';

  public readonly statusCode: number = 403;
}

export default BarbecueRSVPDoesNotBelongToUserException;
