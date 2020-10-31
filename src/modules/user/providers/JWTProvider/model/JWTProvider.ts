export default interface JWTProvider {
  generateToken(userId: string): Promise<string>;
}
