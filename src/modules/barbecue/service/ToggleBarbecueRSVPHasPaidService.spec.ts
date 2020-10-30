import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';
import CreateBarbecueService from './CreateBarbecueService';

import ToggleBarbecueRSVPHasPaidService from './ToggleBarbecueRSVPHasPaidService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;
let toggleBarbecueRSVPHasPaid: ToggleBarbecueRSVPHasPaidService;

describe('ToggleBarbecueRSVPHasPaidService', () => {
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
    toggleBarbecueRSVPHasPaid = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
  });

  it('should be able to toggle RSVP hasPaid for a barbecueRSVP', async () => {
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: johnDoe.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
      hasPaid: false,
      rsvp: true,
    });

    const hasPaidBeforeToggle = false;

    await toggleBarbecueRSVPHasPaid.run({
      barbecueRSVPId: barbecueRSVP.id,
      loggedInUserId: johnDoe.id,
    });

    const newRSVPHasPaid = await mockBarbecueRSVPRepository.findById(
      barbecueRSVP.id,
    );

    expect(newRSVPHasPaid?.hasPaid).toBe(!hasPaidBeforeToggle);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP if the barbecue does not belong to the logged in user', async () => {
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: johnDoe.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
      hasPaid: false,
      rsvp: true,
    });

    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: janeDoe.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP that does not exist', async () => {
    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP if the barbecue does not exist for any reason', async () => {
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

    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
