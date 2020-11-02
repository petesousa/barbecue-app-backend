import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';

import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';

import CreateUserService from '@modules/user/service/CreateUserService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import ToggleBarbecueRSVPHasPaidService from '@modules/barbecue/service/ToggleBarbecueRSVPHasPaidService';

import GetBarbecueRSVPStatusService from '@modules/barbecue/service/GetBarbecueRSVPStatusService';

let mockDateProvider: MockDateProvider;
let mockHashProvider: MockHashProvider;
let mockUserRepository: MockUserRepository;

let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;

let createUser: CreateUserService;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let toggleBarbecueRSVPHasPaidStatus: ToggleBarbecueRSVPHasPaidService;

let getBarbecueRSVPStatus: GetBarbecueRSVPStatusService;

describe('GetBarbecueRSVPStatus', () => {
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
    getBarbecueRSVPStatus = new GetBarbecueRSVPStatusService(
      mockUserRepository,
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
    toggleBarbecueRSVPHasPaidStatus = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
  });

  it('should be able to get a given barbecue RSVP Status', async () => {
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });
    const jonasDoe = await createUser.run({
      username: 'jonas.doe',
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

    barbecue.drinksPrice = 20;
    barbecue.mealPrice = 25;
    await mockBarbecueRepository.save(barbecue);
    const janeRSVP = await createBarbecueRSVP.run({
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    const jonasRSVP = await createBarbecueRSVP.run({
      userId: jonasDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: true,
    });

    await toggleBarbecueRSVPHasPaidStatus.run({
      rsvpId: jonasRSVP.id,
      loggedInUserId: johnDoe.id,
    });

    const test = await mockBarbecueRepository.findById(barbecue.id);
    const barbecueRSVPStatus = await getBarbecueRSVPStatus.run({
      barbecue: test || barbecue,
      loggedInUserId: janeDoe.id,
    });

    expect(barbecueRSVPStatus).toEqual({
      loggedInUserRSVP: {
        id: janeRSVP.id,
        userId: janeRSVP.userId,
        barbecueId: janeRSVP.barbecueId,
        rsvp: janeRSVP.rsvp,
        willEat: janeRSVP.willEat,
        willDrink: janeRSVP.willDrink,
        hasPaid: janeRSVP.hasPaid,
      },
      rsvpList: [
        {
          id: jonasRSVP.id,
          userId: jonasRSVP.userId,
          barbecueId: jonasRSVP.barbecueId,
          rsvp: jonasRSVP.rsvp,
          willEat: jonasRSVP.willEat,
          willDrink: jonasRSVP.willDrink,
          hasPaid: jonasRSVP.hasPaid,
          user: {
            userId: jonasDoe.id,
            username: jonasDoe.username,
          },
        },
      ],
      otherUsers: [
        {
          userId: johnDoe.id,
          username: johnDoe.username,
        },
      ],
      rsvpProgress: {
        rsvp: 2,
        noRSVP: 1,
      },
      budgetProgress: {
        confirmed: 70,
        paid: 45,
      },
    });
  });
});
