import ICreateUserDTO from '../dto/ICreateUserDTO';
import User from '../infra/typeorm/entity/User';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
