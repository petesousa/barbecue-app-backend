import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import { ListUserDTO } from '@modules/user/dto/ListUserDTO';
import BarbecueRSVPDetailsDTO from './BarbecueRSVPDetailsDTO';

export default interface BarbecueDetailsDTO {
  id: string;
  organizerId: string;
  organizer: string | undefined;
  date: Date;
  hour: number;
  title: string;
  description: string;
  mealPrice: number;
  drinksPrice: number;
  rsvp: {
    loggedInUserRSVP: BarbecueRSVP | undefined;
    rsvpList: BarbecueRSVPDetailsDTO[] | undefined;
    otherUsers: ListUserDTO[];
  };
  isOrganizerLoggedIn: boolean;
}
