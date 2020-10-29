// import { isSameDay } from 'date-fns';
import { getRepository, Repository } from 'typeorm';
import IBarbecueRepository from '@modules/barbecue/repository/IBarbecueRepository';
import ICreateBarbecueDTO from '@modules/barbecue/dto/ICreateBarbecueDTO';

import Barbecue from '../entity/Barbecue';

class BarbecueRepository implements IBarbecueRepository {
  private ormRepository: Repository<Barbecue>;

  constructor() {
    this.ormRepository = getRepository(Barbecue);
  }

  public async create({
    date,
    organizerId,
  }: ICreateBarbecueDTO): Promise<Barbecue> {
    const barbecue = this.ormRepository.create({ organizerId, date });
    await this.ormRepository.save(barbecue);

    return barbecue;
  }

  public async findByDate(date: Date): Promise<Barbecue | undefined> {
    const findBarbecue = await this.ormRepository.findOne({
      where: { date },
    });

    return findBarbecue;
  }
}

export default BarbecueRepository;
