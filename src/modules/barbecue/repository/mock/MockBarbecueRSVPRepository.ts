import { v4 } from 'uuid';
import IBarbecueRSVPRepository from '@modules/barbecue/repository/IBarbecueRSVPRepository';
import ICreateBarbecueRSVPDTO from '@modules/barbecue/dto/ICreateBarbecueRSVPDTO';
import BarbecueRSVP from '@modules/barbecue/infra/typeorm/entity/BarbecueRSVP';

class MockBarbecueRSVPRepository implements IBarbecueRSVPRepository {
  private barbecueRSVPList: BarbecueRSVP[] = [];

  public async create({
    barbecueId,
    userId,
    willDrink,
    willEat,
  }: ICreateBarbecueRSVPDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = new BarbecueRSVP();

    Object.assign(barbecueRSVP, {
      id: v4(),
      barbecueId,
      userId,
      willDrink,
      willEat,
    });

    this.barbecueRSVPList.push(barbecueRSVP);
    return barbecueRSVP;
  }

  public async findByBarbecueId(
    barbecueId: string,
  ): Promise<BarbecueRSVP[] | undefined> {
    const findBarbecue = this.barbecueRSVPList.filter(
      rsvp => barbecueId === rsvp.barbecueId,
    );

    return findBarbecue;
  }

  public async rsvpExists(
    barbecueId: string,
    userId: string,
  ): Promise<BarbecueRSVP | undefined> {
    const findBarbecue = this.barbecueRSVPList.find(
      barbecue =>
        barbecue.barbecueId === barbecueId && barbecue.userId === userId,
    );

    return findBarbecue;
  }
}

export default MockBarbecueRSVPRepository;
