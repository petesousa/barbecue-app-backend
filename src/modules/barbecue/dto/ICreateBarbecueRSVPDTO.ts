export default interface ICreateBarbecueRSVPDTO {
  userId: string;
  barbecueId: string;
  willDrink: boolean;
  willEat: boolean;
  rsvp: boolean;
  hasPaid: boolean;
}
