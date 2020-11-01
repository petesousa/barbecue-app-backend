import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';
import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

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
    if (!this.dateProvider.isDateValid(date)) {
      throw new GenericError('Invalid date!');
    }

    if (this.dateProvider.isDateInThePast(date)) {
      throw new GenericError('Date in the past!');
    }

    const isDateBooked = await this.barbecueRepository.findByDate(date);
    if (isDateBooked) {
      throw new GenericError('Date is already booked!');
    }

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
