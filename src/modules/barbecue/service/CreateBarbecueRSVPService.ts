import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

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
