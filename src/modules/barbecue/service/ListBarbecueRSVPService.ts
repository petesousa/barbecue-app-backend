import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

@injectable()
class ListBarbecueRSVPService {
  constructor(
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run(barbecueId: string): Promise<BarbecueRSVP[]> {
    return this.barbecueRSVPRepository.findByBarbecueId(barbecueId);
  }
}

export default ListBarbecueRSVPService;
