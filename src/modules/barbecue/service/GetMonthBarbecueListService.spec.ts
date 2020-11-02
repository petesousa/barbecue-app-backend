import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

import ToggleBarbecueRSVPWillDrinkService from '@modules/barbecue/service/ToggleBarbecueRSVPWillDrinkService';
import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';
import { addHours } from 'date-fns';
import GetMonthBarbecueListService from './GetMonthBarbecueListService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;
let toggleBarbecueRSVPWillDrink: ToggleBarbecueRSVPWillDrinkService;
let mockDateProvider: MockDateProvider;

let getMonth: GetMonthBarbecueListService;

describe('GetMonthBarbecueList', () => {
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
    toggleBarbecueRSVPWillDrink = new ToggleBarbecueRSVPWillDrinkService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
      mockDateProvider,
    );
    getMonth = new GetMonthBarbecueListService(
      mockUserRepository,
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
      mockDateProvider,
    );
  });

  it('should be able to toggle RSVP willDrink for a barbecueRSVP', async () => {
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const bbqDate = addHours(new Date(), 12);
    const barbecue = await createBarbecue.run({
      date: bbqDate,
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    barbecue.mealPrice = 25;
    barbecue.drinksPrice = 20;
    await mockBarbecueRepository.save(barbecue);

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: user.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });

    await toggleBarbecueRSVPWillDrink.run({
      rsvpId: barbecueRSVP.id,
      loggedInUserId: user.id,
    });

    const monthCalendar = await getMonth.run({
      month: 11,
      year: 2020,
      loggedInUserId: user.id,
    });

    expect(monthCalendar).toContainEqual({
      day: bbqDate.getDate(),
      barbecue: {
        id: barbecue.id,
        organizer: user.username,
        date: bbqDate,
        hour: undefined,
        title: undefined,
        priceRange: {
          from: 20,
          to: 45,
        },
        rsvp: {
          no: 0,
          yes: 1,
        },
        isOrganizerLoggedIn: true,
      },
    });
  });
});
