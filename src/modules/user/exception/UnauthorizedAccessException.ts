import UserException from './UserException';

class UnauthorizedAccessException extends UserException {
  public readonly message: string = 'Operação não autorizada.';

  public readonly statusCode: number = 403;
}

export default UnauthorizedAccessException;
