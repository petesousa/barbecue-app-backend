import CreateUserDTO from '@modules/user/dto/CreateUserDTO';
import User from '@modules/user/entity/typeorm/User';

export default interface UserRepository {
  all(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  create(data: CreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
