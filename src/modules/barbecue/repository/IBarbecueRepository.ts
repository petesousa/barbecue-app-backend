import Barbecue from '../infra/typeorm/entity/Barbecue';

import ICreateBarbecueDTO from '../dto/ICreateBarbecueDTO';

export default interface IBarbecueRepository {
  create(data: ICreateBarbecueDTO): Promise<Barbecue>;
  findByDate(date: Date): Promise<Barbecue | undefined>;
}
