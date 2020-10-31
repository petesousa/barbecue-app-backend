export default interface CreateBarbecueDTO {
  organizerId: string;
  date: Date;
  hour: number;
  title: string;
  description: string;
  mealPrice: number;
  drinksPrice: number;
}
