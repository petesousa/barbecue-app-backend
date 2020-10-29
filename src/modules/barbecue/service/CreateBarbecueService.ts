import GenericError from '@shared/errors/GenericError';
import { isValid, startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Barbecue from '../infra/typeorm/entity/Barbecue';
import IBarbecueRepository from '../repository/IBarbecueRepository';

interface ICreateBarbecueRequestDTO {
  organizerId: string;
  date: Date;
}

@injectable()
class CreateBarbecueService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: IBarbecueRepository,
  ) {}

  public async run({
    organizerId,
    date,
  }: ICreateBarbecueRequestDTO): Promise<Barbecue> {
    const barbecueDate = startOfHour(date);

    if (!isValid(barbecueDate)) {
      throw new GenericError('Data Inválida');
    }

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
