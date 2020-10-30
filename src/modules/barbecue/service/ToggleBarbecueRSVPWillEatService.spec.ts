import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';
import CreateBarbecueService from './CreateBarbecueService';

import ToggleBarbecueRSVPWillEatService from './ToggleBarbecueRSVPWillEatService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;
let toggleBarbecueRSVPWillEat: ToggleBarbecueRSVPWillEatService;

describe('ToggleBarbecueRSVPWillEat', () => {
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
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
    toggleBarbecueRSVPWillEat = new ToggleBarbecueRSVPWillEatService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
  });

  it('should be able to toggle RSVP willEat for a barbecueRSVP', async () => {
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

    const willEatBeforeToggle = barbecueRSVP.willEat;

    const newRSVPWillEat = await toggleBarbecueRSVPWillEat.run({
      barbecueRSVPId: barbecueRSVP.id,
      loggedInUserId: user.id,
    });

    expect(newRSVPWillEat.willEat).toBe(!willEatBeforeToggle);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP if it does not belong to the logged in user', async () => {
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

    expect(
      toggleBarbecueRSVPWillEat.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: 'wrongUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP that does not exist', async () => {
    expect(
      toggleBarbecueRSVPWillEat.run({
        barbecueRSVPId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP if the barbecue does not exist for any reason', async () => {
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

    barbecueRSVP.barbecueId = 'wrongBarbecueId';
    await mockBarbecueRSVPRepository.save(barbecueRSVP);

    const toggleBarbecue = new ToggleBarbecueRSVPWillEatService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP if the barbecue has already happened', async () => {
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

    barbecue.date = new Date('2020-01-01');
    await mockBarbecueRepository.save(barbecue);

    const toggleBarbecue = new ToggleBarbecueRSVPWillEatService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
