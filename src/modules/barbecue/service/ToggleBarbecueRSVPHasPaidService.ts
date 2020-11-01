import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import TouchRSVPRequestDTO from '@modules/barbecue/dto/TouchRSVPRequestDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueDoesNotBelongToUserException from '../exception/BarbecueDoesNotBelongToUserException';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueRSVPDoesNotExistException from '../exception/BarbecueRSVPDoesNotExistException';

@injectable()
class ToggleBarbecueRSVPHasPaidService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    rsvpId,
    loggedInUserId,
  }: TouchRSVPRequestDTO): Promise<BarbecueRSVP> {
    const rsvp = await this.barbecueRSVPRepository.findById(rsvpId);
    if (!rsvp) throw new BarbecueRSVPDoesNotExistException();

    const barbecue = await this.barbecueRepository.findById(rsvp.barbecueId);

    if (!barbecue) throw new BarbecueDoesNotExistException();

    if (barbecue.organizerId !== loggedInUserId)
      throw new BarbecueDoesNotBelongToUserException();

    rsvp.hasPaid = !rsvp.hasPaid;

    return this.barbecueRSVPRepository.save(rsvp);
  }
}

export default ToggleBarbecueRSVPHasPaidService;
