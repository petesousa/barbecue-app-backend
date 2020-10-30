import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import { isBefore, startOfDay } from 'date-fns';
import BarbecueRSVP from '../infra/typeorm/entity/BarbecueRSVP';
import IToggleBarbecueRSVPWillDrinkDTO from '../dto/IToggleBarbecueRSVPWillDrinkDTO';
import IBarbecueRepository from '../repository/IBarbecueRepository';
import IBarbecueRSVPRepository from '../repository/IBarbecueRSVPRepository';

@injectable()
class ToggleBarbecueRSVPWillDrinkService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: IBarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: IBarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueRSVPId,
    loggedInUserId,
  }: IToggleBarbecueRSVPWillDrinkDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = await this.barbecueRSVPRepository.findById(
      barbecueRSVPId,
    );
    if (!barbecueRSVP) {
      throw new GenericError('Barbecue RSVP does not exist');
    }

    if (barbecueRSVP.userId !== loggedInUserId) {
      throw new GenericError('Barbecue RSVP does not belong to this user');
    }

    const barbecue = await this.barbecueRepository.findById(
      barbecueRSVP.barbecueId,
    );

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (isBefore(startOfDay(new Date(barbecue.date)), startOfDay(new Date()))) {
      throw new GenericError('Barbecue has already happened');
    }

    barbecueRSVP.willDrink = !barbecueRSVP.willDrink;

    return this.barbecueRSVPRepository.save(barbecueRSVP);
  }
}

export default ToggleBarbecueRSVPWillDrinkService;
