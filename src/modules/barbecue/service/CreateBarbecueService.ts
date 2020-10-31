import GenericError from '@shared/errors/GenericError';
import { isValid, isBefore, startOfDay } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';
import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';

@injectable()
class CreateBarbecueService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
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
    if (!isValid(date)) {
      throw new GenericError('Data Inválida!');
    }

    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      throw new GenericError('Data no passado!');
    }

    const isDateBooked = await this.barbecueRepository.findByDate(date);
    if (isDateBooked) {
      throw new GenericError('Já tem um churras nesse dia!');
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
