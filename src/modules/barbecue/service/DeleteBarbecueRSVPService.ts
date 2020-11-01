import { injectable, inject } from 'tsyringe';

import { DeleteResult } from 'typeorm';

import TouchRSVPRequestDTO from '@modules/barbecue/dto/TouchRSVPRequestDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';
import BarbecueRSVPDoesNotExistException from '../exception/BarbecueRSVPDoesNotExistException';
import BarbecueRSVPDoesNotBelongToUserException from '../exception/BarbecueRSVPDoesNotBelongToUserException';
import BarbecueRSVPIsPaidForException from '../exception/BarbecueRSVPIsPaidForException';
import BarbecueDoesNotExistException from '../exception/BarbecueDoesNotExistException';
import BarbecueHasAlreadyHappenedException from '../exception/BarbecueHasAlreadyHappenedException';

@injectable()
class DeleteBarbecueRSVPService {
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
  }: TouchRSVPRequestDTO): Promise<DeleteResult> {
    const rsvp = await this.barbecueRSVPRepository.findById(rsvpId);
    if (!rsvp) throw new BarbecueRSVPDoesNotExistException();

    if (rsvp.userId !== loggedInUserId)
      throw new BarbecueRSVPDoesNotBelongToUserException();

    if (rsvp.hasPaid) throw new BarbecueRSVPIsPaidForException();

    const barbecue = await this.barbecueRepository.findById(rsvp.barbecueId);

    if (!barbecue) throw new BarbecueDoesNotExistException();

    if (this.dateProvider.isDateInThePast(barbecue.date))
      throw new BarbecueHasAlreadyHappenedException();

    return this.barbecueRSVPRepository.delete(rsvp);
  }
}

export default DeleteBarbecueRSVPService;
