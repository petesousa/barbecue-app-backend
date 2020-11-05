import BarbecueException from './BarbecueException';

class BeforeStartOfTimeException extends BarbecueException {
  public readonly message: string =
    'Não temos registros de churras antes de 2020.';

  public readonly statusCode: number = 400;
}

export default BeforeStartOfTimeException;
