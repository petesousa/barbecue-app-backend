import { getRepository, Repository } from 'typeorm';
import IUserRepository from '@modules/user/repository/IUserRepository';
import ICreateUserDTO from '@modules/user/dto/ICreateUserDTO';

import User from '../entity/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({ username, password }: ICreateUserDTO): Promise<User> {
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

export default UserRepository;
