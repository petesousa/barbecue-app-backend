import UserException from './UserException';

class InvalidCredentialsException extends UserException {
  public readonly message: string = 'Credenciais inválidas.';

  public readonly statusCode: number = 403;
}

export default InvalidCredentialsException;
