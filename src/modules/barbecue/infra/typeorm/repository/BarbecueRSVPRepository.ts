import { DeleteResult, getRepository, Repository } from 'typeorm';
import IBarbecueRSVPRepository from '@modules/barbecue/repository/IBarbecueRSVPRepository';
import ICreateBarbecueRSVPDTO from '@modules/barbecue/dto/ICreateBarbecueRSVPDTO';

import BarbecueRSVP from '../entity/BarbecueRSVP';

class BarbecueRSVPRepository implements IBarbecueRSVPRepository {
  private ormRepository: Repository<BarbecueRSVP>;

  constructor() {
    this.ormRepository = getRepository(BarbecueRSVP);
  }

  public async create({
    barbecueId,
    userId,
    willDrink,
    willEat,
    hasPaid,
    rsvp,
  }: ICreateBarbecueRSVPDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = this.ormRepository.create({
      barbecueId,
      userId,
      willDrink,
      willEat,
      hasPaid,
      rsvp,
    });
    await this.ormRepository.save(barbecueRSVP);

    return barbecueRSVP;
  }

  public async findById(id: string): Promise<BarbecueRSVP | undefined> {
    const findBarbecueRSVP = await this.ormRepository.findOne(id);

    return findBarbecueRSVP;
  }

  public async findByBarbecueId(
    barbecueId: string,
  ): Promise<BarbecueRSVP[] | undefined> {
    const findBarbecueRSVPList = await this.ormRepository.find({
      where: { barbecueId },
    });

    return findBarbecueRSVPList;
  }

  public async rsvpExists(
    barbecueId: string,
    userId: string,
  ): Promise<BarbecueRSVP | undefined> {
    const findBarbecueRSVP = await this.ormRepository.findOne({
      where: { barbecueId, userId },
    });

    return findBarbecueRSVP;
  }

  public async save(barbecueRSVP: BarbecueRSVP): Promise<BarbecueRSVP> {
    return this.ormRepository.save(barbecueRSVP);
  }

  public async delete(barbecueRSVP: BarbecueRSVP): Promise<DeleteResult> {
    return this.ormRepository.delete(barbecueRSVP.id);
  }
}

export default BarbecueRSVPRepository;
