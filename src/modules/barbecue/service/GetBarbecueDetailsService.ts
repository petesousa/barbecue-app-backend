import { injectable, inject } from 'tsyringe';

import GenericError from '@shared/errors/GenericError';

import GetBarbecueDetailsRequestDTO from '@modules/barbecue/dto/GetBarbecueDetailsRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueDetailsDTO from '@modules/barbecue/dto/BarbecueDetailsDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import UserRepository from '@modules/user/repository/UserRepository';

import GetBarbecueRSVPStatusService from './GetBarbecueRSVPStatusService';

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

    const getBarbecueRSVPStatus = new GetBarbecueRSVPStatusService(
      this.barbecueRepository,
      this.barbecueRSVPRepository,
    );

    const rsvp = await getBarbecueRSVPStatus.run({ barbecue, loggedInUserId });

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
