import { getRepository, Repository } from 'typeorm';
import UserRepository from '@modules/user/repository/UserRepository';
import CreateUserDTO from '@modules/user/dto/CreateUserDTO';

import User from '@modules/user/entity/typeorm/User';

class UserRepositoryImpl implements UserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({ username, password }: CreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ username, password });
    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { username },
    });

    return user;
  }
}

export default UserRepositoryImpl;
