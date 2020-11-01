import BarbecueRSVPStatusDTO from './BarbecueRSVPStatusDTO';

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
  rsvp: BarbecueRSVPStatusDTO | undefined;
  isOrganizerLoggedIn: boolean;
}
