import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';

import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';
import GetBarbecueDetailsService from './GetBarbecueDetailsService';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;

let mockDateProvider: MockDateProvider;
let getBarbecueDetails: GetBarbecueDetailsService;

describe('GetBarbecueDetails', () => {
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
    getBarbecueDetails = new GetBarbecueDetailsService(
      mockUserRepository,
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );
  });

  it('should be able to get a given barbecue details', async () => {
    const JohnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const JaneDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });
    const JonasDoe = await createUser.run({
      username: 'jonas.doe',
      password: 'whatevs',
    });

    const bbqDate = new Date();
    const barbecue = await createBarbecue.run({
      date: bbqDate,
      organizerId: JohnDoe.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    barbecue.mealPrice = 25;
    barbecue.drinksPrice = 20;
    await mockBarbecueRepository.save(barbecue);

    const janeRSVP = await createBarbecueRSVP.run({
      userId: JaneDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    const jonasRSVP = await createBarbecueRSVP.run({
      userId: JonasDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: true,
    });

    jonasRSVP.hasPaid = true;
    await mockBarbecueRSVPRepository.save(jonasRSVP);

    const details = await getBarbecueDetails.run({
      barbecueId: barbecue.id,
      loggedInUserId: JohnDoe.id,
    });

    expect(details).toEqual({
      id: barbecue.id,
      date: bbqDate,
      organizerId: JohnDoe.id,
      mealPrice: 25,
      drinksPrice: 20,
      organizer: JohnDoe.username,
      isOrganizerLoggedIn: true,
      rsvp: {
        loggedInUserRSVP: undefined,
        rsvpList: [
          {
            barbecueId: barbecue.id,
            hasPaid: false,
            id: janeRSVP.id,
            rsvp: true,
            user: {
              userId: JaneDoe.id,
              username: JaneDoe.username,
            },
            userId: JaneDoe.id,
            willDrink: false,
            willEat: true,
          },
          {
            barbecueId: barbecue.id,
            hasPaid: true,
            id: jonasRSVP.id,
            rsvp: true,
            user: {
              userId: JonasDoe.id,
              username: JonasDoe.username,
            },
            userId: JonasDoe.id,
            willDrink: true,
            willEat: true,
          },
        ],
        otherUsers: [
          {
            userId: JohnDoe.id,
            username: JohnDoe.username,
          },
        ],
        rsvpProgress: { rsvp: 2, noRSVP: 1 },
        budgetProgress: { confirmed: 70, paid: 45 },
      },
    });
  });

  it('should not be able to get details for a barbecue that does not exist', async () => {
    const JohnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const JaneDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });
    const JonasDoe = await createUser.run({
      username: 'jonas.doe',
      password: 'whatevs',
    });

    const bbqDate = new Date();
    const barbecue = await createBarbecue.run({
      date: bbqDate,
      organizerId: JohnDoe.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    barbecue.mealPrice = 25;
    barbecue.drinksPrice = 20;
    await mockBarbecueRepository.save(barbecue);

    const jonasRSVP = await createBarbecueRSVP.run({
      userId: JonasDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: true,
    });

    jonasRSVP.hasPaid = true;
    await mockBarbecueRSVPRepository.save(jonasRSVP);

    expect(
      getBarbecueDetails.run({
        barbecueId: '2b968a8b-cec0-4690-96d6-24cb38e98324',
        loggedInUserId: JohnDoe.id,
      }),
    ).rejects.toBeInstanceOf(BarbecueDoesNotExistException);
  });
});
