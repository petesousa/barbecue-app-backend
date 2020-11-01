import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import CreateBarbecueRSVPDTO from '@modules/barbecue/dto/CreateBarbecueRSVPDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueHasAlreadyHappenedException from '../exception/BarbecueHasAlreadyHappenedException';
import BarbecueRSVPAlreadyExistsException from '../exception/BarbecueRSVPAlreadyExistsException';

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
    if (!barbecue) throw new BarbecueDoesNotExistException();

    if (this.dateProvider.isDateInThePast(barbecue.date))
      throw new BarbecueHasAlreadyHappenedException();

    const rsvpExists = await this.barbecueRSVPRepository.rsvpExists(
      barbecueId,
      userId,
    );
    if (rsvpExists) throw new BarbecueRSVPAlreadyExistsException();

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
