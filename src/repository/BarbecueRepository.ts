// import { isSameDay } from 'date-fns';
import { EntityRepository, Repository } from 'typeorm';
import Barbecue from '../entity/Barbecue';

@EntityRepository(Barbecue)
class BarbecueRepository extends Repository<Barbecue> {
  public async findByDate(date: Date): Promise<Barbecue | null> {
    const findBarbecue = await this.findOne({
      where: { date },
    });

    return findBarbecue || null;
  }
}

export default BarbecueRepository;
