import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '@modules/barbecue/repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '@modules/barbecue/repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

import DeleteBarbecueRSVPService from '@modules/barbecue/service/DeleteBarbecueRSVPService';

let mockUserRepository: MockUserRepository;
let mockHashProvider: MockHashProvider;
let mockBarbecueRepository: MockBarbecueRepository;
let mockBarbecueRSVPRepository: MockBarbecueRSVPRepository;
let createBarbecue: CreateBarbecueService;
let createBarbecueRSVP: CreateBarbecueRSVPService;
let createUser: CreateUserService;

describe('DeleteBarbecueRSVP', () => {
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
  });

  it('should be able to delete a given barbecueRSVP', async () => {
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

    const deleteBarbecueRSVP = new DeleteBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    await deleteBarbecueRSVP.run({
      rsvpId: barbecueRSVP.id,
      loggedInUserId: user.id,
    });

    const findRSVP = await mockBarbecueRSVPRepository.findById(barbecueRSVP.id);

    expect(findRSVP).toBeUndefined();
  });

  it('should not be able to delete a barbecueRSVP if it does not belong to the logged in user', async () => {
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

    const toggleBarbecue = new DeleteBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: 'wrongUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to delete a barbecueRSVP that does not exist', async () => {
    const toggleBarbecue = new DeleteBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        rsvpId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to delete a barbecueRSVP if the barbecue does not exist for any reason', async () => {
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

    const toggleBarbecue = new DeleteBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to delete a barbecueRSVP if the barbecue has already happened', async () => {
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

    const toggleBarbecue = new DeleteBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        rsvpId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
