import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import CreateBarbecueRSVPDTO from '@modules/barbecue/dto/CreateBarbecueRSVPDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

@injectable()
class CreateBarbecueRSVPService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,

    @inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  public async run({
    userId,
    barbecueId,
    willEat,
    willDrink,
  }: CreateBarbecueRSVPDTO): Promise<BarbecueRSVP> {
    const barbecue = await this.barbecueRepository.findById(barbecueId);
    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (this.dateProvider.isDateInThePast(barbecue.date)) {
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
    });

    return barbecueRSVP;
  }
}

export default CreateBarbecueRSVPService;
