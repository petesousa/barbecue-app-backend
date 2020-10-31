import { injectable, inject } from 'tsyringe';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import ListBarbecueRSVPDTO from '@modules/barbecue/dto/ListBarbecueRSVPDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

@injectable()
class ListBarbecueRSVPService {
  constructor(
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueId,
  }: ListBarbecueRSVPDTO): Promise<BarbecueRSVP[] | undefined> {
    return this.barbecueRSVPRepository.findByBarbecueId(barbecueId);
  }
}

export default ListBarbecueRSVPService;
