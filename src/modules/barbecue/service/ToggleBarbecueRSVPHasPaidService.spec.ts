import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import CreateUserService from '@modules/user/service/CreateUserService';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';
import CreateBarbecueService from './CreateBarbecueService';

import ToggleBarbecueRSVPHasPaidService from './ToggleBarbecueRSVPHasPaidService';

describe('ToggleBarbecueRSVPHasPaidService', () => {
  it('should be able to toggle RSVP hasPaid for a barbecueRSVP', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: johnDoe.id,
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
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
      hasPaid: false,
      rsvp: true,
    });

    const hasPaidBeforeToggle = false;

    const toggleBarbecueRSVPHasPaid = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    await toggleBarbecueRSVPHasPaid.run({
      barbecueRSVPId: barbecueRSVP.id,
      loggedInUserId: johnDoe.id,
    });

    const newRSVPHasPaid = await mockBarbecueRSVPRepository.findById(
      barbecueRSVP.id,
    );

    expect(newRSVPHasPaid?.rsvp !== hasPaidBeforeToggle);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP if the barbecue does not belong to the logged in user', async () => {
    const mockUserRepository = new MockUserRepository();
    const mockHashProvider = new MockHashProvider();
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const createUser = new CreateUserService(
      mockUserRepository,
      mockHashProvider,
    );
    const johnDoe = await createUser.run({
      username: 'john.doe',
      password: 'whatevs',
    });
    const janeDoe = await createUser.run({
      username: 'jane.doe',
      password: 'whatevs',
    });

    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: johnDoe.id,
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
      userId: janeDoe.id,
      barbecueId: barbecue.id,
      willEat: true,
      willDrink: false,
      hasPaid: false,
      rsvp: true,
    });

    const toggleBarbecueRSVPHasPaid = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: janeDoe.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP that does not exist', async () => {
    const mockBarbecueRepository = new MockBarbecueRepository();
    const mockBarbecueRSVPRepository = new MockBarbecueRSVPRepository();

    const toggleBarbecueRSVPHasPaid = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: 'anyNonExistentRSVPId',
        loggedInUserId: 'anyUserId',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to toggle RSVP hasPaid for a barbecueRSVP if the barbecue does not exist for any reason', async () => {
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

    const toggleBarbecueRSVPHasPaid = new ToggleBarbecueRSVPHasPaidService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      toggleBarbecueRSVPHasPaid.run({
        barbecueRSVPId: barbecueRSVP.id,
        loggedInUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
