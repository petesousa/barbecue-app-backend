import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../entity/User';

import GenericError from '../errors/GenericError';

interface CreateUserRequestDTO {
  username: string;
  password: string;
}

interface CreateUserResponseDTO {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

class CreateUserService {
  public async run({
    username,
    password,
  }: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    const userRepository = getRepository(User);

    const isUsernameTaken = await userRepository.findOne({
      where: { username },
    });

    if (isUsernameTaken) {
      throw new GenericError('Username já existe');
    }

    const encryptedPassword = await hash(password, 8);

    const user = userRepository.create({
      username,
      password: encryptedPassword,
    });

    await userRepository.save(user);

    const response: CreateUserResponseDTO = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  }
}

export default CreateUserService;
