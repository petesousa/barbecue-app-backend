import { v4 } from 'uuid';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import CreateBarbecueRSVPDTO from '@modules/barbecue/dto/CreateBarbecueRSVPDTO';
import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import { DeleteResult } from 'typeorm';

class MockBarbecueRSVPRepository implements BarbecueRSVPRepository {
  private barbecueRSVPList: BarbecueRSVP[] = [];

  public async create({
    barbecueId,
    userId,
    willDrink,
    willEat,
  }: CreateBarbecueRSVPDTO): Promise<BarbecueRSVP> {
    const barbecueRSVP = new BarbecueRSVP();

    Object.assign(barbecueRSVP, {
      id: v4(),
      barbecueId,
      userId,
      willDrink,
      willEat,
      hasPaid: false,
      rsvp: true,
    });

    this.barbecueRSVPList.push(barbecueRSVP);
    return barbecueRSVP;
  }

  public async findById(id: string): Promise<BarbecueRSVP | undefined> {
    const findBarbecue = this.barbecueRSVPList.find(rsvp => rsvp.id === id);

    return findBarbecue;
  }

  public async findByBarbecueId(barbecueId: string): Promise<BarbecueRSVP[]> {
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

  public async save(barbecueRSVP: BarbecueRSVP): Promise<BarbecueRSVP> {
    const findIndex = this.barbecueRSVPList.findIndex(
      rsvp => rsvp.id === barbecueRSVP.id,
    );

    this.barbecueRSVPList[findIndex] = barbecueRSVP;
    return barbecueRSVP;
  }

  public async delete(barbecueRSVP: BarbecueRSVP): Promise<DeleteResult> {
    const findIndex = this.barbecueRSVPList.findIndex(
      rsvp => rsvp.id === barbecueRSVP.id,
    );

    this.barbecueRSVPList.splice(findIndex);
    return new DeleteResult();
  }
}

export default MockBarbecueRSVPRepository;
