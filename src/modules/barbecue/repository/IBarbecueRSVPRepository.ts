import { DeleteResult } from 'typeorm';
import BarbecueRSVP from '../infra/typeorm/entity/BarbecueRSVP';
import ICreateBarbecueRSVPDTO from '../dto/ICreateBarbecueRSVPDTO';

export default interface IBarbecueRSVPRepository {
  create(data: ICreateBarbecueRSVPDTO): Promise<BarbecueRSVP>;
  findById(id: string): Promise<BarbecueRSVP | undefined>;
  findByBarbecueId(barbecueId: string): Promise<BarbecueRSVP[] | undefined>;
  rsvpExists(
    barbecueId: string,
    userId: string,
  ): Promise<BarbecueRSVP | undefined>;
  save(barbecueRSVP: BarbecueRSVP): Promise<BarbecueRSVP>;
  delete(barbecueRSVP: BarbecueRSVP): Promise<DeleteResult>;
}
