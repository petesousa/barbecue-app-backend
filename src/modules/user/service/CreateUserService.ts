import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';
import HashProvider from '@modules/user/providers/HashProvider/model/HashProvider';
import UserRepository from '@modules/user/repository/UserRepository';
import CreateUserDTO from '@modules/user/dto/CreateUserDTO';
import CreateUserResponseDTO from '@modules/user/dto/CreateUserResponseDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async run({
    username,
    password,
  }: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const isUsernameTaken = await this.userRepository.findByUsername(username);
    if (isUsernameTaken) throw new GenericError('Username já existe');

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      username,
      password: encryptedPassword,
    });

    const response: CreateUserResponseDTO = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };

    return response;
  }
}

export default CreateUserService;
