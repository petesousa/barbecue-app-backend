import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth';
import IAuthSessionTokenPayloadDTO from '@modules/user/dto/AuthSessionTokenPayloadDTO';
import UnauthorizedAccessException from '@modules/user/exception/UnauthorizedAccessException';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new UnauthorizedAccessException();

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as IAuthSessionTokenPayloadDTO;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new UnauthorizedAccessException();
  }
}
