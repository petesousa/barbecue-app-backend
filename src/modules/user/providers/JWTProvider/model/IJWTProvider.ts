export default interface IJWTProvider {
  generateToken(userId: string): Promise<string>;
}
