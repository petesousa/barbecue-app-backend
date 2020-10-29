import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';

import GenericError from '../errors/GenericError';
import User from '../entity/User';

interface LoginUserRequestDTO {
  username: string;
  password: string;
}

interface LoggedUserResponseDTO {
  id: string;
  username: string;
}

interface LoginUserResponseDTO {
  user: LoggedUserResponseDTO;
  token: string;
}

class LoginUserService {
  public async run({
    username,
    password,
  }: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new GenericError('Credenciais inválidas', 401);
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new GenericError('Credenciais inválidas', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const loggedUserResponse: LoggedUserResponseDTO = {
      id: user.id,
      username: user.username,
    };

    const response: LoginUserResponseDTO = {
      user: loggedUserResponse,
      token,
    };

    return response;
  }
}

export default LoginUserService;
