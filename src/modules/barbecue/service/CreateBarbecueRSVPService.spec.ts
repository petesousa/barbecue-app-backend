import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import CreateUserService from '@modules/user/service/CreateUserService';

import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';

import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockDateProvider: MockDateProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;

describe('CreateBarbecueRSVP', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    mockDateProvider = new MockDateProvider();
    mockBarbecueRepository = new MockBarbecueRepository();
    mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();
    createBarbecue = new CreateBarbecueService(
      mockBarbecueRepository,
      mockDateProvider,
    );
    createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
      mockDateProvider,
    );
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
  });

  it('should be able to create a new barbecue RSVP', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: user.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);
  });

  it('should not be able to create a new barbecue RSVP if barbecue does not exist', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: '873981278291',
        willEat: true,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a new barbecue RSVP if barbecue has already happened', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    barbecue.date = new Date('2020-01-01');
    await mockBarbecueRepository.save(barbecue);

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a new barbecue RSVP if there is an entry with the same barbecueId and userId combination', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: user.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
