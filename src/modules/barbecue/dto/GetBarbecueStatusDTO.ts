import Barbecue from '@modules/barbecue/entity/typeorm/Barbecue';

export default interface GetBarbecueStatusDTO {
  barbecue: Barbecue;
  loggedInUserId: string;
}
