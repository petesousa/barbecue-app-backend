import GenericError from '@shared/errors/GenericError';
import MockUserRepository from '../repository/mock/MockUserRepository';
import MockHashProvider from '../providers/HashProvider/mock/MockHashProvider';
import MockJWTProvider from '../providers/JWTProvider/mock/MockJWTProvider';

import CreateUserService from './CreateUserService';
import CreateSessionService from './CreateSessionService';

describe('CreateSession', () => {
  it('should be able to log user in', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockJWTProvider = new MockJWTProvider();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const createSession = new CreateSessionService(
      mockUserRepository,
      mockHashProvider,
      mockJWTProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const session = await createSession.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    expect(session).toHaveProperty('token');
    expect(session.user).toEqual(user);
  });

  it('should not be able to log user in if password is incorrect', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockJWTProvider = new MockJWTProvider();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const createSession = new CreateSessionService(
      mockUserRepository,
      mockHashProvider,
      mockJWTProvider,
    );
    await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    expect(
      createSession.run({
        username: 'john.doe',
        password: 'wrongpasswordforthisuser',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to log in if user does not exist', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockJWTProvider = new MockJWTProvider();

    const createSession = new CreateSessionService(
      mockUserRepository,
      mockHashProvider,
      mockJWTProvider,
    );

    expect(
      createSession.run({
        username: 'john.doe',
        password: 'whatevs',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
