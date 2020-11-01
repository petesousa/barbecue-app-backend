import UserException from './UserException';

class InvalidCredentialsException extends UserException {
  public readonly message: string = 'Invalid Credentials.';

  public readonly statusCode: number = 403;
}

export default InvalidCredentialsException;
