import { injectable, inject } from 'tsyringe';

import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

import BarbecueRSVP from '@modules/barbecue/entity/typeorm/BarbecueRSVP';
import TouchRSVPRequestDTO from '@modules/barbecue/dto/TouchRSVPRequestDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueRSVPDoesNotExistException from '../exception/BarbecueRSVPDoesNotExistException';
import BarbecueRSVPDoesNotBelongToUserException from '../exception/BarbecueRSVPDoesNotBelongToUserException';
import BarbecueRSVPIsPaidForException from '../exception/BarbecueRSVPIsPaidForException';
import CantEditBarbecueRSVPNotConfirmedException from '../exception/CantEditBarbecueRSVPNotConfirmedException';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueHasAlreadyHappenedException from '../exception/BarbecueHasAlreadyHappenedException';

@injectable()
class ToggleBarbecueRSVPWillDrinkService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,

    @inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  public async run({
    rsvpId,
    loggedInUserId,
  }: TouchRSVPRequestDTO): Promise<BarbecueRSVP> {
    const rsvp = await this.barbecueRSVPRepository.findById(rsvpId);
    if (!rsvp) throw new BarbecueRSVPDoesNotExistException();

    if (rsvp.userId !== loggedInUserId)
      throw new BarbecueRSVPDoesNotBelongToUserException();

    if (rsvp.hasPaid) throw new BarbecueRSVPIsPaidForException();

    if (!rsvp.rsvp) throw new CantEditBarbecueRSVPNotConfirmedException();

    const barbecue = await this.barbecueRepository.findById(rsvp.barbecueId);

    if (!barbecue) throw new BarbecueDoesNotExistException();

    if (this.dateProvider.isDateInThePast(barbecue.date))
      throw new BarbecueHasAlreadyHappenedException();

    rsvp.willDrink = !rsvp.willDrink;

    return this.barbecueRSVPRepository.save(rsvp);
  }
}

export default ToggleBarbecueRSVPWillDrinkService;
