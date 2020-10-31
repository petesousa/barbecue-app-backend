import JWTProvider from '../model/JWTProvider';

class MockJWTProvider implements JWTProvider {
  public async generateToken(userId: string): Promise<string> {
    return `${userId}-token`;
  }
}

export default MockJWTProvider;
