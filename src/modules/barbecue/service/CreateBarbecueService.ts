import { injectable, inject } from 'tsyringe';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';
import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';
import InvalidDateException from '@shared/exception/InvalidDateException';
import CantCreateBarbecueInThePastException from '../exception/CantCreateBarbecueInThePastException';
import DateIsAlreadyBookedException from '../exception/DateIsAlreadyBookedException';

@injectable()
class CreateBarbecueService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  public async run({
    organizerId,
    date,
    hour,
    title,
    description,
    mealPrice,
    drinksPrice,
  }: CreateBarbecueDTO): Promise<Barbecue> {
    if (!this.dateProvider.isDateValid(date)) throw new InvalidDateException();

    if (this.dateProvider.isDateInThePast(date))
      throw new CantCreateBarbecueInThePastException();

    const isDateBooked = await this.barbecueRepository.findByDate(date);
    if (isDateBooked) throw new DateIsAlreadyBookedException();

    const barbecue = await this.barbecueRepository.create({
      organizerId,
      date,
      hour,
      title,
      description,
      mealPrice,
      drinksPrice,
    });

    return barbecue;
  }
}

export default CreateBarbecueService;
