import GenericError from '@shared/errors/GenericError';
import { isValid } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Barbecue from '../infra/typeorm/entity/Barbecue';
import ICreateBarbecueDTO from '../dto/ICreateBarbecueDTO';
import IBarbecueRepository from '../repository/IBarbecueRepository';

@injectable()
class CreateBarbecueService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: IBarbecueRepository,
  ) {}

  public async run({
    organizerId,
    date,
    hour,
    title,
    description,
    mealPrice,
    drinksPrice,
  }: ICreateBarbecueDTO): Promise<Barbecue> {
    if (!isValid(date)) {
      throw new GenericError('Data Inválida');
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
