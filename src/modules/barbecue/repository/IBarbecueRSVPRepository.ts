import BarbecueRSVP from '../infra/typeorm/entity/BarbecueRSVP';
import ICreateBarbecueRSVPDTO from '../dto/ICreateBarbecueRSVPDTO';

export default interface IBarbecueRSVPRepository {
  create(data: ICreateBarbecueRSVPDTO): Promise<BarbecueRSVP>;
  findByBarbecueId(barbecueId: string): Promise<BarbecueRSVP[] | undefined>;
  rsvpExists(
    barbecueId: string,
    userId: string,
  ): Promise<BarbecueRSVP | undefined>;
}
