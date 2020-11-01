import { injectable, inject } from 'tsyringe';

import HashProvider from '@modules/user/providers/HashProvider/model/HashProvider';
import JWTProvider from '@modules/user/providers/JWTProvider/model/JWTProvider';
import UserRepository from '@modules/user/repository/UserRepository';
import CreateSessionRequestDTO from '@modules/user/dto/CreateSessionRequestDTO';
import LoggedUserDTO from '@modules/user/dto/LoggedUserDTO';
import CreateSessionResponseDTO from '@modules/user/dto/CreateSessionResponseDTO';
import InvalidCredentialsException from '../exception/InvalidCredentialsException';

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
    if (!user) throw new InvalidCredentialsException();

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      user.password,
    );
    if (!passwordMatches) throw new InvalidCredentialsException();

    const token = await this.jwtProvider.generateToken(user.id);

    const response: CreateSessionResponseDTO = {
      user: {
        id: user.id,
        username: user.username,
      } as LoggedUserDTO,
      token,
    };

    return response;
  }
}

export default CreateSessionService;
