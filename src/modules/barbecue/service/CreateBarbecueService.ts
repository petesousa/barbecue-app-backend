import GenericError from '@shared/errors/GenericError';
import { isValid, startOfDay } from 'date-fns';
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
  }: ICreateBarbecueDTO): Promise<Barbecue> {
    if (!isValid(date)) {
      throw new GenericError('Data Inválida');
    }
    const barbecueDate = startOfDay(date);

    const isDateBooked = await this.barbecueRepository.findByDate(barbecueDate);
    if (isDateBooked) {
      throw new GenericError('Já tem um churras nesse dia!');
    }

    const barbecue = await this.barbecueRepository.create({
      organizerId,
      date: barbecueDate,
    });

    return barbecue;
  }
}

export default CreateBarbecueService;
