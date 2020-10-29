import GenericError from '@shared/errors/GenericError';
import MockUserRepository from '../repository/mock/MockUserRepository';
import MockHashProvider from '../providers/HashProvider/mock/MockHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('john.doe');
  });

  it('should not be able to create a new user if username is taken', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
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
