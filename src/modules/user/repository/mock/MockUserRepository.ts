import { v4 } from 'uuid';

import UserRepository from '@modules/user/repository/UserRepository';
import CreateUserDTO from '@modules/user/dto/CreateUserDTO';
import User from '@modules/user/entity/typeorm/User';

class MockUserRepository implements UserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.username === username);
    return findUser;
  }

  public async create(userData: CreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: v4() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;

    return user;
  }
}

export default MockUserRepository;
