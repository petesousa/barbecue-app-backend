import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';
import BarbecuePostItDTO from './BarbecuePostItDTO';

export default interface CalendarDayContentDTO {
  day: number;
  barbecue: Barbecue | BarbecuePostItDTO | undefined;
}
