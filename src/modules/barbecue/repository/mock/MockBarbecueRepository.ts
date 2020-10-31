import { v4 } from 'uuid';
import { isEqual } from 'date-fns';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';

import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';

class MockBarbecueRepository implements BarbecueRepository {
  private barbecues: Barbecue[] = [];

  public async create({
    date,
    organizerId,
  }: CreateBarbecueDTO): Promise<Barbecue> {
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
