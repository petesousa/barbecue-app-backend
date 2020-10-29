import { v4 } from 'uuid';
import { isEqual } from 'date-fns';
import IBarbecueRepository from '@modules/barbecue/repository/IBarbecueRepository';
import ICreateBarbecueDTO from '@modules/barbecue/dto/ICreateBarbecueDTO';

import Barbecue from '@modules/barbecue/infra/typeorm/entity/Barbecue';

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

  public async findByDate(date: Date): Promise<Barbecue | undefined> {
    const findBarbecue = this.barbecues.find(barbecue =>
      isEqual(date, barbecue.date),
    );

    return findBarbecue;
  }
}

export default MockBarbecueRepository;
