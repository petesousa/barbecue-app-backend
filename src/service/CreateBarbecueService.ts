import { isValid, startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import GenericError from '../errors/GenericError';

import Barbecue from '../entity/Barbecue';
import BarbecueRepository from '../repository/BarbecueRepository';

interface CreateBarbecueRequestDTO {
  organizerId: string;
  date: Date;
}

class CreateBarbecueService {
  public async run({
    organizerId,
    date,
  }: CreateBarbecueRequestDTO): Promise<Barbecue> {
    const barbecueRepository = getCustomRepository(BarbecueRepository);

    const barbecueDate = startOfHour(date);

    if (!isValid(barbecueDate)) {
      throw new GenericError('Data Inválida');
    }

    const isDateBooked = await barbecueRepository.findByDate(barbecueDate);
    if (isDateBooked) {
      throw new GenericError('Já tem um churras nesse dia!');
    }

    const barbecue = barbecueRepository.create({
      organizerId,
      date: barbecueDate,
    });

    await barbecueRepository.save(barbecue);

    return barbecue;
  }
}

export default CreateBarbecueService;
