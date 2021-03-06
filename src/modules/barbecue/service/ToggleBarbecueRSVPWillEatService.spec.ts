import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';
import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

import ToggleBarbecueRSVPWillEatService from '@modules/barbecue/service/ToggleBarbecueRSVPWillEatService';
import BarbecueRSVPDoesNotBelongToUserException from '../exception/BarbecueRSVPDoesNotBelongToUserException';
import BarbecueRSVPDoesNotExistException from '../exception/BarbecueRSVPDoesNotExistException';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueHasAlreadyHappenedException from '../exception/BarbecueHasAlreadyHappenedException';
import CantEditBarbecueRSVPNotConfirmedException from '../exception/CantEditBarbecueRSVPNotConfirmedException';
import BarbecueRSVPIsPaidForException from '../exception/BarbecueRSVPIsPaidForException';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;
let toggleBarbecueRSVPWillEat: ToggleBarbecueRSVPWillEatService;
let mockDateProvider: MockDateProvider;

describe('ToggleBarbecueRSVPWillEat', () => {
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
    toggleBarbecueRSVPWillEat = new ToggleBarbecueRSVPWillEatService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
      mockDateProvider,
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
    });

    const willEatBeforeToggle = barbecueRSVP.willEat;

    const newRSVPWillEat = await toggleBarbecueRSVPWillEat.run({
      rsvpId: barbecueRSVP.id,
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
    });

    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: 'wrongUserId',
      }),
    ).rejects.toBeInstanceOf(BarbecueRSVPDoesNotBelongToUserException);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP that does not exist', async () => {
    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(BarbecueRSVPDoesNotExistException);
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
    });

    barbecueRSVP.barbecueId = 'wrongBarbecueId';
    await mockBarbecueRSVPRepository.save(barbecueRSVP);

    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueDoesNotExistException);
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
    });

    barbecue.date = new Date('2020-01-01');
    await mockBarbecueRepository.save(barbecue);

    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueHasAlreadyHappenedException);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP if user has not confirmed RSVP', async () => {
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

    barbecueRSVP.rsvp = false;
    await mockBarbecueRSVPRepository.save(barbecueRSVP);

    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(CantEditBarbecueRSVPNotConfirmedException);
  });

  it('should not be able to toggle RSVP willEat for a barbecueRSVP if it is already paid for', async () => {
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
      willEat: false,
      willDrink: false,
    });

    barbecueRSVP.hasPaid = true;
    await mockBarbecueRSVPRepository.save(barbecueRSVP);

    expect(
      toggleBarbecueRSVPWillEat.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueRSVPIsPaidForException);
  });
});
