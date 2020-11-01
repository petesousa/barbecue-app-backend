import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import TouchRSVPRequestDTO from '@modules/barbecue/dto/TouchRSVPRequestDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

@injectable()
class ToggleBarbecueRSVPWillDrinkService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,

    @inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  public async run({
    rsvpId,
    loggedInUserId,
  }: TouchRSVPRequestDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = await this.barbecueRSVPRepository.findById(rsvpId);
    if (!barbecueRSVP) {
      throw new GenericError('Barbecue RSVP does not exist');
    }

    if (barbecueRSVP.userId !== loggedInUserId) {
      throw new GenericError('Barbecue RSVP does not belong to this user');
    }

    if (barbecueRSVP.hasPaid) {
      throw new GenericError('RSVP Is already paid for');
    }

    if (!barbecueRSVP.rsvp) {
      throw new GenericError('Cannot edit RSVP that is not confirmed');
    }

    const barbecue = await this.barbecueRepository.findById(
      barbecueRSVP.barbecueId,
    );

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (this.dateProvider.isDateInThePast(barbecue.date)) {
      throw new GenericError('Barbecue has already happened');
    }

    barbecueRSVP.willDrink = !barbecueRSVP.willDrink;

    return this.barbecueRSVPRepository.save(barbecueRSVP);
  }
}

export default ToggleBarbecueRSVPWillDrinkService;
