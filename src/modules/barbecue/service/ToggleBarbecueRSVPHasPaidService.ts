import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '../infra/typeorm/entity/BarbecueRSVP';
import IToggleBarbecueRSVPDTO from '../dto/IToggleBarbecueRSVPDTO';
import IBarbecueRepository from '../repository/IBarbecueRepository';
import IBarbecueRSVPRepository from '../repository/IBarbecueRSVPRepository';

@injectable()
class ToggleBarbecueRSVPHasPaidService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: IBarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: IBarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueRSVPId,
    loggedInUserId,
  }: IToggleBarbecueRSVPDTO): Promise<BarbecueRSVP> {
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
