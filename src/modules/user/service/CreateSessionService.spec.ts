import GenericError from '@shared/errors/GenericError';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockJWTProvider from '@modules/user/providers/JWTProvider/mock/MockJWTProvider';

import CreateUserService from '@modules/user/service/CreateUserService';
import CreateSessionService from '@modules/user/service/CreateSessionService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockJWTProvider: MockJWTProvider;
let createUser: CreateUserService;
let createSession: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    mockJWTProvider = new MockJWTProvider();
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
    createSession = new CreateSessionService(
      mockUserRepository,
      mockHashProvider,
      mockJWTProvider,
    );
  });
  it('should be able to log user in', async () => {
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
    expect(
      createSession.run({
        username: 'john.doe',
        password: 'whatevs',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
