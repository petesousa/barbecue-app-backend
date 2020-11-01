import { ListUserDTO } from '@modules/user/dto/ListUserDTO';
import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import BarbecueRSVPDetailsDTO from './BarbecueRSVPDetailsDTO';

export default interface BarbecueRSVPStatusDTO {
  loggedInUserRSVP: BarbecueRSVP | undefined;
  rsvpList: BarbecueRSVPDetailsDTO[] | undefined;
  otherUsers: ListUserDTO[];
  rsvpProgress: {
    rsvp: number;
    noRSVP: number;
  };
  budgetProgress: {
    confirmed: number;
    paid: number;
  };
}
