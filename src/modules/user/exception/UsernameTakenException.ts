import UserException from './UserException';

class UsernameTakeException extends UserException {
  public readonly message: string = 'Username is taken.';

  public readonly statusCode: number = 400;
}

export default UsernameTakeException;
