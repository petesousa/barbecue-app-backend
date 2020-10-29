import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import GenericError from '@shared/errors/GenericError';
import IHashProvider from '@modules/user/providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repository/IUserRepository';

interface ICreateSessionRequestDTO {
  username: string;
  password: string;
}

interface ILoggedUserResponseDTO {
  id: string;
  username: string;
}

interface ICreateSessionResponseDTO {
  user: ILoggedUserResponseDTO;
  token: string;
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
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

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

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
