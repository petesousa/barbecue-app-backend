import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import ToggleBarbecueRSVPHasPaidDTO from '@modules/barbecue/dto/ToggleBarbecueRSVPHasPaidDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

@injectable()
class ToggleBarbecueRSVPHasPaidService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueRSVPId,
    loggedInUserId,
  }: ToggleBarbecueRSVPHasPaidDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = await this.barbecueRSVPRepository.findById(
      barbecueRSVPId,
    );
    if (!barbecueRSVP) {
      throw new GenericError('Barbecue RSVP does not exist');
    }

    const barbecue = await this.barbecueRepository.findById(
      barbecueRSVP.barbecueId,
    );

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (barbecue.organizerId !== loggedInUserId) {
      throw new GenericError('Barbecue does not belong to this user');
    }

    barbecueRSVP.hasPaid = !barbecueRSVP.hasPaid;

    return this.barbecueRSVPRepository.save(barbecueRSVP);
  }
}

export default ToggleBarbecueRSVPHasPaidService;
