import MockHashProvider from '@modules/user/providers/HashProvider/mock/MockHashProvider';
import CreateUserService from '@modules/user/service/CreateUserService';

import MockUserRepository from '@modules/user/repository/mock/MockUserRepository';
import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';
import MockBarbecueRSVPRepository from '../repository/mock/MockBarbecueRSVPRepository';

import CreateBarbecueService from './CreateBarbecueService';
import CreateBarbecueRSVPService from './CreateBarbecueRSVPService';

describe('CreateBarbecueRSVP', () => {
  it('should be able to create a new barbecue RSVP', async () => {
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
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);
  });

  it('should not be able to create a new barbecue RSVP if barbecue does not exist', async () => {
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

    const createBarbecueRSVP = new CreateBarbecueRSVPService(
      mockBarbecueRepository,
      mockBarbecueRSVPRepository,
    );

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: '873981278291',
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a new barbecue RSVP if there is an entry with the same barbecueId and userId combination', async () => {
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
    expect(barbecueRSVP).toHaveProperty('id');
    expect(barbecueRSVP.barbecueId).toBe(barbecue.id);

    expect(
      createBarbecueRSVP.run({
        userId: user.id,
        barbecueId: barbecue.id,
        willEat: true,
        willDrink: false,
        hasPaid: false,
        rsvp: true,
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
