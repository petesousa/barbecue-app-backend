import DateException from './DateException';

class InvalidMonthException extends DateException {
  public readonly message: string = 'Invalid number for month.';

  public readonly statusCode: number = 400;
}

export default InvalidMonthException;
