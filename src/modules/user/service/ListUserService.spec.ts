import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';

import CreateUserService from '@modules/user/service/CreateUserService';
import ListUserService from '@modules/user/service/ListUserService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let createUser: CreateUserService;
let listUser: ListUserService;

describe('ListUser', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
    listUser = new ListUserService(mockUserRepository);
  });
  it('should be able to get the list of users', async () => {
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });
    const jamesDoe = await createUser.run({
      username: 'james.doe',
      password: 'whatevs',
    });
    const jimmyDoe = await createUser.run({
      username: 'jimmy.doe',
      password: 'whatevs',
    });

    const userList = await listUser.run();

    expect(userList).toEqual([
      {
        userId: johnDoe.id,
        username: 'john.doe',
      },
      {
        userId: janeDoe.id,
        username: 'jane.doe',
      },
      {
        userId: jamesDoe.id,
        username: 'james.doe',
      },
      {
        userId: jimmyDoe.id,
        username: 'jimmy.doe',
      },
    ]);
  });
});
