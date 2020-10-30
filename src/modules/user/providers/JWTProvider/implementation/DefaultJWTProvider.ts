import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IJWTProvider from '../model/IJWTProvider';

class DefaultJWTProvider implements IJWTProvider {
  public async generateToken(userId: string): Promise<string> {
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: userId,
      expiresIn,
    });
    return token;
  }
}

export default DefaultJWTProvider;
