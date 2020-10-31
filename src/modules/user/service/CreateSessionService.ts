import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';
import HashProvider from '@modules/user/providers/HashProvider/model/HashProvider';
import JWTProvider from '@modules/user/providers/JWTProvider/model/JWTProvider';
import UserRepository from '@modules/user/repository/UserRepository';
import CreateSessionRequestDTO from '@modules/user/dto/CreateSessionRequestDTO';
import LoggedUserResponseDTO from '@modules/user/dto/LoggedUserResponseDTO';
import CreateSessionResponseDTO from '@modules/user/dto/CreateSessionResponseDTO';

@injectable()
class CreateSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('JWTProvider')
    private jwtProvider: JWTProvider,
  ) {}

  public async run({
    username,
    password,
  }: CreateSessionRequestDTO): Promise<CreateSessionResponseDTO> {
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

    const loggedUserResponse: LoggedUserResponseDTO = {
      id: user.id,
      username: user.username,
    };

    const response: CreateSessionResponseDTO = {
      user: loggedUserResponse,
      token,
    };

    return response;
  }
}

export default CreateSessionService;
