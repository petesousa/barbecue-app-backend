import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';
import IHashProvider from '@modules/user/providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repository/IUserRepository';

interface ICreateUserRequestDTO {
  username: string;
  password: string;
}

interface ICreateUserResponseDTO {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async run({
    username,
    password,
  }: ICreateUserRequestDTO): Promise<ICreateUserResponseDTO> {
    const isUsernameTaken = await this.userRepository.findByUsername(username);

    if (isUsernameTaken) {
      throw new GenericError('Username já existe');
    }

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      username,
      password: encryptedPassword,
    });

    const response: ICreateUserResponseDTO = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  }
}

export default CreateUserService;
