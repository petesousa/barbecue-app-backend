import { injectable, inject } from 'tsyringe';

import GetBarbecueByDateRequestDTO from '@modules/barbecue/dto/GetBarbecueByDateRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueDetailsDTO from '@modules/barbecue/dto/BarbecueDetailsDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import UserRepository from '@modules/user/repository/UserRepository';

import GetBarbecueRSVPStatusService from './GetBarbecueRSVPStatusService';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';

@injectable()
class GetBarbecueByDateService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    date,
    loggedInUserId,
  }: GetBarbecueByDateRequestDTO): Promise<BarbecueDetailsDTO | undefined> {
    const barbecue = await this.barbecueRepository.findByDate(date);

    if (!barbecue) throw new BarbecueDoesNotExistException();

    const getBarbecueRSVPStatus = new GetBarbecueRSVPStatusService(
      this.userRepository,
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

export default GetBarbecueByDateService;
