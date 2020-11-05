import BarbecueException from './BarbecueException';

class BarbecueDoesNotBelongToUserException extends BarbecueException {
  public readonly message: string =
    'Somente o organizador do churras pode fazer essa operação.';

  public readonly statusCode: number = 403;
}

export default BarbecueDoesNotBelongToUserException;
