import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import User from '@modules/user/entity/typeorm/User';
import UserRepository from '@modules/user/repository/UserRepository';
import { ListUserDTO } from '../dto/ListUserDTO';

@injectable()
class ListUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  public async run(): Promise<ListUserDTO[]> {
    const findAllUsers = await this.userRepository.all();

    return findAllUsers.map((user: User) => {
      return { userId: user.id, username: user.username } as ListUserDTO;
    });
  }
}

export default ListUserService;
