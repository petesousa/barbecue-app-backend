import { container, injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';

import GetBarbecueDetailsRequestDTO from '@modules/barbecue/dto/GetBarbecueDetailsRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueDetailsDTO from '@modules/barbecue/dto/BarbecueDetailsDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import UserRepository from '@modules/user/repository/UserRepository';

import ListUserService from '@modules/user/service/ListUserService';
import ListBarbecueRSVPService from '@modules/barbecue/service/ListBarbecueRSVPService';

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

    const listUsers = container.resolve(ListUserService);
    const allUsers = await listUsers.run();

    const barbecueRSVP = container.resolve(ListBarbecueRSVPService);
    const rsvp = await barbecueRSVP.run({ barbecueId });

    const rsvpUserIds = rsvp?.map(each => each.userId);
    const rsvpList = rsvp?.filter(each => each.userId !== loggedInUserId);

    const rsvpDTOList = rsvpList?.map(each => {
      const rsvpUser = allUsers.find(user => user.userId === each.userId);
      return {
        ...each,
        user: {
          userId: each.userId,
          username: rsvpUser?.username,
        },
      };
    });

    const otherUsers = allUsers.filter(
      user => !rsvpUserIds?.includes(user.userId),
    );

    const organizer = await this.userRepository.findById(barbecue.organizerId);
    const isOrganizerLoggedIn = loggedInUserId === barbecue.organizerId;
    const loggedInUserRSVP = await this.barbecueRSVPRepository.rsvpExists(
      barbecueId,
      loggedInUserId,
    );

    return {
      ...barbecue,
      organizer: organizer?.username,
      loggedInUserRSVP,
      rsvpList: rsvpDTOList,
      otherUsers,
      isOrganizerLoggedIn,
    };
  }
}

export default GetBarbecueDetailsService;
