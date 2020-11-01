import { getRepository, Raw, Repository } from 'typeorm';
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

  public async listByMonth(month: number, year: number): Promise<Barbecue[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDate = `${parsedMonth}-${year}`;

    const barbecues = await this.ormRepository.find({
      where: {
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedDate}'`,
        ),
      },
    });

    return barbecues;
  }

  public async save(barbecue: Barbecue): Promise<Barbecue> {
    return this.ormRepository.save(barbecue);
  }
}

export default BarbecueRepositoryImpl;
