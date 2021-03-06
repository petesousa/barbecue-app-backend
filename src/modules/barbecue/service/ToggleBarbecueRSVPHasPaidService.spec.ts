import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

import ToggleBarbecueRSVPHasPaidService from '@modules/barbecue/service/ToggleBarbecueRSVPHasPaidService';
import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';
import BarbecueDoesNotBelongToUserException from '../exception/BarbecueDoesNotBelongToUserException';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueRSVPDoesNotExistException from '../exception/BarbecueRSVPDoesNotExistException';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockDateProvider: MockDateProvider;
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
    });

    const hasPaidBeforeToggle = false;

    await toggleBarbecueRSVPHasPaid.run({
      rsvpId: barbecueRSVP.id,
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
    });

    expect(
      toggleBarbecueRSVPHasPaid.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: janeDoe.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueDoesNotBelongToUserException);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP that does not exist', async () => {
    expect(
      toggleBarbecueRSVPHasPaid.run({
        rsvpId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(BarbecueRSVPDoesNotExistException);
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
    });

    barbecueRSVP.barbecueId = 'wrongBarbecueId';
    await mockBarbecueRSVPRepository.save(barbecueRSVP);

    expect(
      toggleBarbecueRSVPHasPaid.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueDoesNotExistException);
  });
});
