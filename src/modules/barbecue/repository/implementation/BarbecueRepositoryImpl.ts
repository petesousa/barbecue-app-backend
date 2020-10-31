import { getRepository, Repository } from 'typeorm';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';

class BarbecueRepositoryImpl implements BarbecueRepository {
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
  }: CreateBarbecueDTO): Promise<Barbecue> {
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

export default BarbecueRepositoryImpl;
