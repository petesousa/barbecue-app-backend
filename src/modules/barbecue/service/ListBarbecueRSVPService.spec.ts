import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import CreateUserService from '@modules/user/service/CreateUserService';

import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';

import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import ListBarbecueRSVPService from '@modules/barbecue/service/ListBarbecueRSVPService';
import MockDateProvider from '@shared/providers/DateProvider/mock/MockDateProvider';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockDateProvider: MockDateProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;
let listBarbecueRSVP: ListBarbecueRSVPService;

describe('ListBarbecueRSVP', () => {
  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    mockHashProvider = new MockHashProvider();
    mockDateProvider = new MockDateProvider();
    mockBarbecueRepository = new MockBarbecueRepository();
    mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();
    createUser = new CreateUserService(mockUserRepository, mockHashProvider);
    createBarbecue = new CreateBarbecueService(
      mockBarbecueRepository,
      mockDateProvider,
    );
    createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
      mockDateProvider,
    );
    listBarbecueRSVP = new ListBarbecueRSVPService(mockBarbecueRSVPRepository);
  });

  it('should be able to see a given barbecue RSVP list', async () => {
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

    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: johnDoe.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const janeDoeRSVP = await createBarbecueRSVP.run({
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    const jamesDoeRSVP = await createBarbecueRSVP.run({
      userId: jamesDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });
    const jimmyDoeRSVP = await createBarbecueRSVP.run({
      userId: jimmyDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
    });

    const barbecueRSVPList = await listBarbecueRSVP.run(barbecue.id);

    expect(barbecueRSVPList).toEqual([
      {
        id: janeDoeRSVP.id,
        userId: janeDoe.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      },
      {
        id: jamesDoeRSVP.id,
        userId: jamesDoe.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      },
      {
        id: jimmyDoeRSVP.id,
        userId: jimmyDoe.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      },
    ]);
  });
});
