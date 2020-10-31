export default interface CreateBarbecueRSVPDTO {
  userId: string;
  barbecueId: string;
  willDrink: boolean;
  willEat: boolean;
  rsvp: boolean;
  hasPaid: boolean;
}
