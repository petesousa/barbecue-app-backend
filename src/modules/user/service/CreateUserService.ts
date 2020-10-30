import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';
import IHashProvider from '@modules/user/providers/HashProvider/model/IHashProvider';
import IUserRepository from '../repository/IUserRepository';
import ICreateUserDTO from '../dto/ICreateUserDTO';
import ICreateUserResponseDTO from '../dto/ICreateUserResponseDTO';

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
  }: ICreateUserDTO): Promise<ICreateUserResponseDTO> {
    const isUsernameTaken = await this.userRepository.findByUsername(username);
    if (isUsernameTaken) throw new GenericError('Username já existe');

    const encryptedPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      username,
      password: encryptedPassword,
    });

    const response: ICreateUserResponseDTO = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };

    return response;
  }
}

export default CreateUserService;
