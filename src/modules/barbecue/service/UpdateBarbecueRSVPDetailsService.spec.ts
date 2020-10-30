import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';
import CreateBarbecueService from './CreateBarbecueService';

import UpdateBarbecueRSVPDetailsService from './UpdateBarbecueRSVPDetailsService';

describe('UpdateBarbecueRSVPDetails', () => {
  it('should be able to update RSVP details for a barbecueRSVP', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: user.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: true,
      hasPaid: false,
      rsvp: true,
    });

    const willEatBefore = true;
    const willDrinkBefore = true;

    const updateBarbecue = new UpdateBarbecueRSVPDetailsService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    await updateBarbecue.run({
      barbecueRSVPId: barbecueRSVP.id,
      loggedInUserId: user.id,
      willEat: false,
      willDrink: false,
    });

    const newRSVP = await mockBarbecueRSVPRepository.findById(barbecueRSVP.id);

    expect(newRSVP?.willDrink !== willDrinkBefore);
    expect(newRSVP?.willEat !== willEatBefore);
  });

  it('should not be able to update RSVP Details for a barbecueRSVP if it does not belong to the logged in user', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    const barbecueRSVP = await createBarbecueRSVP.run({
      userId: user.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: true,
      hasPaid: false,
      rsvp: true,
    });

    const toggleBarbecue = new UpdateBarbecueRSVPDetailsService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: 'wrongUserId',
        willEat: false,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to update RSVP details for a barbecueRSVP that does not exist', async () => {
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const toggleBarbecue = new UpdateBarbecueRSVPDetailsService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
        willEat: false,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to update RSVP Details for a barbecueRSVP if the barbecue does not exist for any reason', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

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

    const toggleBarbecue = new UpdateBarbecueRSVPDetailsService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
        willEat: false,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to update RSVP details for a barbecueRSVP if the barbecue has already happened', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const user = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: user.id,
      hour: 18,
      title: 'MockBarbecue',
      description: 'this is just a MockBarbecue',
      mealPrice: 25,
      drinksPrice: 20,
    });

    const createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

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

    const toggleBarbecue = new UpdateBarbecueRSVPDetailsService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecue.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
        willEat: false,
        willDrink: false,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
