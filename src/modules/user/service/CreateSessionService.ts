import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';
import IHashProvider from '@modules/user/providers/HashProvider/model/IHashProvider';
import IJWTProvider from '@modules/user/providers/JWTProvider/model/IJWTProvider';
import IUserRepository from '../repository/IUserRepository';
import ICreateSessionRequestDTO from '../dto/ICreateSessionRequestDTO';
import ILoggedUserResponseDTO from '../dto/ILoggedUserResponseDTO';
import ICreateSessionResponseDTO from '../dto/ICreateSessionResponseDTO';

@injectable()
class CreateSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('JWTProvider')
    private jwtProvider: IJWTProvider,
  ) {}

  public async run({
    username,
    password,
  }: ICreateSessionRequestDTO): Promise<ICreateSessionResponseDTO> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new GenericError('Credenciais inválidas', 401);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      user.password,
    );
    if (!passwordMatches) {
      throw new GenericError('Credenciais inválidas', 401);
    }

    const token = await this.jwtProvider.generateToken(user.id);

    const loggedUserResponse: ILoggedUserResponseDTO = {
      id: user.id,
      username: user.username,
    };

    const response: ICreateSessionResponseDTO = {
      user: loggedUserResponse,
      token,
    };

    return response;
  }
}

export default CreateSessionService;
