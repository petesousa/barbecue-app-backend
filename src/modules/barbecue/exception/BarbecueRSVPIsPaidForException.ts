import BarbecueException from './BarbecueException';

class BarbecueRSVPIsPaidForException extends BarbecueException {
  public readonly message: string = 'Não dá pra editar depois de ter pago ;)';

  public readonly statusCode: number = 400;
}

export default BarbecueRSVPIsPaidForException;
