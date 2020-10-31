import { v4 } from 'uuid';
import { isEqual } from 'date-fns';
import IBarbecueRepository from '@modules/barbecue/repository/IBarbecueRepository';
import ICreateBarbecueDTO from '@modules/barbecue/dto/ICreateBarbecueDTO';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';

class MockBarbecueRepository implements IBarbecueRepository {
  private barbecues: Barbecue[] = [];

  public async create({
    date,
    organizerId,
  }: ICreateBarbecueDTO): Promise<Barbecue> {
    const barbecue = new Barbecue();

    Object.assign(barbecue, { id: v4(), date, organizerId });

    this.barbecues.push(barbecue);
    return barbecue;
  }

  public async findById(id: string): Promise<Barbecue | undefined> {
    const findBarbecue = this.barbecues.find(barbecue => id === barbecue.id);

    return findBarbecue;
  }

  public async findByDate(date: Date): Promise<Barbecue | undefined> {
    const findBarbecue = this.barbecues.find(barbecue =>
      isEqual(date, barbecue.date),
    );

    return findBarbecue;
  }

  public async save(barbecue: Barbecue): Promise<Barbecue> {
    const findIndex = this.barbecues.findIndex(it => it.id === barbecue.id);

    this.barbecues[findIndex] = barbecue;
    return barbecue;
  }
}

export default MockBarbecueRepository;
