import BarbecueException from './BarbecueException';

class CantCreateBarbecueInThePastException extends BarbecueException {
  public readonly message: string = 'Não dá pra agendar um churras no passado.';

  public readonly statusCode: number = 400;
}

export default CantCreateBarbecueInThePastException;
