import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import { isBefore, startOfDay } from 'date-fns';
import BarbecueRSVP from '../infra/typeorm/entity/BarbecueRSVP';
import ICreateBarbecueRSVPDTO from '../dto/ICreateBarbecueRSVPDTO';
import IBarbecueRepository from '../repository/IBarbecueRepository';
import IBarbecueRSVPRepository from '../repository/IBarbecueRSVPRepository';

@injectable()
class CreateBarbecueRSVPService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: IBarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: IBarbecueRSVPRepository,
  ) {}

  public async run({
    userId,
    barbecueId,
    willEat,
    willDrink,
    hasPaid,
    rsvp,
  }: ICreateBarbecueRSVPDTO): Promise<BarbecueRSVP> {
    const barbecue = await this.barbecueRepository.findById(barbecueId);
    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (isBefore(startOfDay(new Date(barbecue.date)), startOfDay(new Date()))) {
      throw new GenericError('Barbecue has already happened');
    }

    const rsvpExists = await this.barbecueRSVPRepository.rsvpExists(
      barbecueId,
      userId,
    );
    if (rsvpExists) {
      throw new GenericError('Barbecue RSVP already exists');
    }

    const barbecueRSVP = await this.barbecueRSVPRepository.create({
      barbecueId,
      userId,
      willDrink,
      willEat,
      rsvp,
      hasPaid,
    });

    return barbecueRSVP;
  }
}

export default CreateBarbecueRSVPService;
