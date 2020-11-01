import { v4 } from 'uuid';
import { isEqual, getMonth, getYear } from 'date-fns';
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

  public async listByMonth(month: number, year: number): Promise<Barbecue[]> {
    const barbecues = await this.barbecues.filter(barbecue => {
      return (
        getMonth(barbecue.date) + 1 === month && getYear(barbecue.date) === year
      );
    });

    return barbecues;
  }

  public async save(barbecue: Barbecue): Promise<Barbecue> {
    const findIndex = this.barbecues.findIndex(it => it.id === barbecue.id);

    this.barbecues[findIndex] = barbecue;
    return barbecue;
  }
}

export default MockBarbecueRepository;
