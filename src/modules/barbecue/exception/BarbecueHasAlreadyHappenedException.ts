import BarbecueException from './BarbecueException';

class BarbecueHasAlreadyHappenedException extends BarbecueException {
  public readonly message: string = 'O churras já rolou!';

  public readonly statusCode: number = 400;
}

export default BarbecueHasAlreadyHappenedException;
