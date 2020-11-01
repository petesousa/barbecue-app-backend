import { container, injectable, inject } from 'tsyringe';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

import GetBarbecueStatusDTO from '@modules/barbecue/dto/GetBarbecueStatusDTO';
import BarbecueRSVPStatusDTO from '@modules/barbecue/dto/BarbecueRSVPStatusDTO';

import ListUserService from '@modules/user/service/ListUserService';
import ListBarbecueRSVPService from '@modules/barbecue/service/ListBarbecueRSVPService';

@injectable()
class GetBarbecueRSVPStatusService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    barbecue,
    loggedInUserId,
  }: GetBarbecueStatusDTO): Promise<BarbecueRSVPStatusDTO | undefined> {
    const listUserService = container.resolve(ListUserService);
    const allUsers = await listUserService.run();

    const listBarbecueRSVPService = container.resolve(ListBarbecueRSVPService);
    const findRsvp = await listBarbecueRSVPService.run(barbecue.id);

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
      barbecue.id,
      loggedInUserId,
    );

    return {
      loggedInUserRSVP,
      rsvpList: rsvpDTOList,
      otherUsers,
      rsvpProgress,
      budgetProgress,
    };
  }
}

export default GetBarbecueRSVPStatusService;
