import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import CreateUserService from '@modules/user/service/CreateUserService';

import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';

import CreateBarbecueService from './CreateBarbecueService';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;

describe('CreateBarbecueRSVP', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    mockBarbecueRepository = new MockBarbecueRepository();
    mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();
    createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
  });

  it('should be able to create a new barbecue RSVP', async () => {
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
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
      hasPaid: false,
      rsvp: true,
    });
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);
  });

  it('should not be able to create a new barbecue RSVP if barbecue does not exist', async () => {
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
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
        hasPaid: false,
        rsvp: true,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a new barbecue RSVP if barbecue has already happened', async () => {
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
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
        hasPaid: false,
        rsvp: true,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a new barbecue RSVP if there is an entry with the same barbecueId and userId combination', async () => {
    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
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
      hasPaid: false,
      rsvp: true,
    });
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
