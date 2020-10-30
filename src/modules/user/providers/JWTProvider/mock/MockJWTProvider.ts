import IJWTProvider from '../model/IJWTProvider';

class MockJWTProvider implements IJWTProvider {
  public async generateToken(userId: string): Promise<string> {
    return `${userId}-token`;
  }
}

export default MockJWTProvider;
