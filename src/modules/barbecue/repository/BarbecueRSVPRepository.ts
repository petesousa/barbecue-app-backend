import { DeleteResult } from 'typeorm';
import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import CreateBarbecueRSVPDTO from '../dto/CreateBarbecueRSVPDTO';

export default interface BarbecueRSVPRepository {
  create(data: CreateBarbecueRSVPDTO): Promise<BarbecueRSVP>;
  findById(id: string): Promise<BarbecueRSVP | undefined>;
  findByBarbecueId(barbecueId: string): Promise<BarbecueRSVP[] | undefined>;
  rsvpExists(
    barbecueId: string,
    userId: string,
  ): Promise<BarbecueRSVP | undefined>;
  save(barbecueRSVP: BarbecueRSVP): Promise<BarbecueRSVP>;
  delete(barbecueRSVP: BarbecueRSVP): Promise<DeleteResult>;
}
