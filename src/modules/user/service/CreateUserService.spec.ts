import GenericError from '@shared/errors/GenericError';
import MockUserRepository from '../repository/mock/MockUserRepository';
import MockHashProvider from '../providers/HashProvider/mock/MockHashProvider';

import CreateUserService from './CreateUserService';

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
    ).rejects.toBeInstanceOf(GenericError);
  });
});
