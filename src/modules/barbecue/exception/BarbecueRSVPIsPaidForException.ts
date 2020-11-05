import BarbecueException from './BarbecueException';

class BarbecueRSVPIsPaidForException extends BarbecueException {
  public readonly message: string =
    'Você já pagou pelo churras... agora vai ;)';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPIsPaidForException;
