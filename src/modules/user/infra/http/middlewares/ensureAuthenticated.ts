import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth';
import GenericError from '@shared/errors/GenericError';
import IAuthSessionTokenPayload from '@modules/user/dto/IAuthSessionTokenPayloadDTO';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new GenericError('O token JWT não existe', 403);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as IAuthSessionTokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new GenericError('Token JWT inválido', 403);
  }
}
