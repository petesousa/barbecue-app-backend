import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';

import CreateBarbecueDTO from '@modules/barbecue/dto/CreateBarbecueDTO';

export default interface BarbecueRepository {
  create(data: CreateBarbecueDTO): Promise<Barbecue>;
  findById(id: string): Promise<Barbecue | undefined>;
  findByDate(date: Date): Promise<Barbecue | undefined>;
  save(barbecue: Barbecue): Promise<Barbecue>;
}
