import BarbecueException from './BarbecueException';

class BarbecueDoesNotExistException extends BarbecueException {
  public readonly message: string = 'Esse churras não existe.';

  public readonly statusCode: number = 400;
}

export default BarbecueDoesNotExistException;
