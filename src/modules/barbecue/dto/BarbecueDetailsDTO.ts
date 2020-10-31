import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import { ListUserDTO } from '@modules/user/dto/ListUserDTO';
import BarbecueRSVPDTO from './BarbecueRSVPDTO';

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
  loggedInUserRSVP: BarbecueRSVP | undefined;
  rsvpList: BarbecueRSVPDTO[] | undefined;
  otherUsers: ListUserDTO[];
  isOrganizerLoggedIn: boolean;
}
