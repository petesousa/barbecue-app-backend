import DateException from './DateException';

class InvalidDateException extends DateException {
  public readonly message: string = 'Invalid Date.';

  public readonly statusCode: number = 400;
}

export default InvalidDateException;
