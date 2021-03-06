import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';

import CreateUserService from '@modules/user/service/CreateUserService';
import UsernameTakeException from '../exception/UsernameTakenException';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('john.doe');
  });

  it('should not be able to create a new user if username is taken', async () => {
    await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    expect(
      createUser.run({
        username: 'john.doe',
        password: 'whatevs',
      }),
    ).rejects.toBeInstanceOf(UsernameTakeException);
  });
});
