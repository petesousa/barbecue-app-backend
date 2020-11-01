import { container, injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';

import GetBarbecueDetailsRequestDTO from '@modules/barbecue/dto/GetBarbecueDetailsRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueDetailsDTO from '@modules/barbecue/dto/BarbecueDetailsDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import UserRepository from '@modules/user/repository/UserRepository';

import ListUserService from '@modules/user/service/ListUserService';
import ListBarbecueRSVPService from '@modules/barbecue/service/ListBarbecueRSVPService';
import BarbecueRSVPStatusDTO from '../dto/BarbecueRSVPStatusDTO';

@injectable()
class GetBarbecueDetailsService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueId,
    loggedInUserId,
  }: GetBarbecueDetailsRequestDTO): Promise<BarbecueDetailsDTO | undefined> {
    const barbecue = await this.barbecueRepository.findById(barbecueId);

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    const listUserService = container.resolve(ListUserService);
    const allUsers = await listUserService.run();

    const listBarbecueRSVPService = container.resolve(ListBarbecueRSVPService);
    const findRsvp = await listBarbecueRSVPService.run(barbecueId);

    const rsvpProgress = {
      rsvp: findRsvp.length,
      noRSVP: allUsers.length - findRsvp.length,
    };

    const budgetProgress = {
      confirmed: 0,
      paid: 0,
    };

    findRsvp.forEach(rsvp => {
      let total = 0;
      if (rsvp.willDrink) total += barbecue.drinksPrice;
      if (rsvp.willEat) total += barbecue.mealPrice;
      budgetProgress.confirmed += total;
      if (rsvp.hasPaid) budgetProgress.paid += total;
    });
    const rsvpUserIds = findRsvp.map(rsvp => {
      return rsvp.userId;
    });
    const rsvpList = findRsvp.filter(item => item.userId !== loggedInUserId);

    const rsvpDTOList = rsvpList.map(item => {
      const rsvpUser = allUsers.find(user => user.userId === item.userId);
      return {
        ...item,
        user: {
          userId: item.userId,
          username: rsvpUser?.username,
        },
      };
    });
    const otherUsers = allUsers.filter(
      user => !rsvpUserIds?.includes(user.userId),
    );

    const loggedInUserRSVP = await this.barbecueRSVPRepository.rsvpExists(
      barbecueId,
      loggedInUserId,
    );

    const rsvp = {
      loggedInUserRSVP,
      rsvpList: rsvpDTOList,
      otherUsers,
      rsvpProgress,
      budgetProgress,
    } as BarbecueRSVPStatusDTO;

    const organizer = await this.userRepository.findById(barbecue.organizerId);
    const isOrganizerLoggedIn = loggedInUserId === barbecue.organizerId;

    return {
      ...barbecue,
      organizer: organizer?.username,
      isOrganizerLoggedIn,
      rsvp,
    };
  }
}

export default GetBarbecueDetailsService;
