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
    hour,
    title,
    description,
    mealPrice,
    drinksPrice,
  }: ICreateBarbecueDTO): Promise<Barbecue> {
    const barbecue = this.ormRepository.create({
      organizerId,
      date,
      hour,
      title,
      description,
      mealPrice,
      drinksPrice,
    });
    await this.ormRepository.save(barbecue);

    return barbecue;
  }

  public async findById(id: string): Promise<Barbecue | undefined> {
    const findBarbecue = await this.ormRepository.findOne(id);

    return findBarbecue;
  }

  public async findByDate(date: Date): Promise<Barbecue | undefined> {
    const findBarbecue = await this.ormRepository.findOne({
      where: { date },
    });

    return findBarbecue;
  }

  public async save(barbecue: Barbecue): Promise<Barbecue> {
    return this.ormRepository.save(barbecue);
  }
}

export default BarbecueRepository;
