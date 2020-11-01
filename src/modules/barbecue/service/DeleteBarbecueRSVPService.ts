import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import { DeleteResult } from 'typeorm';

import TouchRSVPRequestDTO from '@modules/barbecue/dto/TouchRSVPRequestDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

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
    const barbecueRSVP = await this.barbecueRSVPRepository.findById(rsvpId);
    if (!barbecueRSVP) {
      throw new GenericError('Barbecue RSVP does not exist');
    }

    if (barbecueRSVP.userId !== loggedInUserId) {
      throw new GenericError('Barbecue RSVP does not belong to this user');
    }

    if (barbecueRSVP.hasPaid) {
      throw new GenericError(
        'Cannot remove RSVP because it is already paid for',
      );
    }

    const barbecue = await this.barbecueRepository.findById(
      barbecueRSVP.barbecueId,
    );

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (this.dateProvider.isDateInThePast(barbecue.date)) {
      throw new GenericError('Barbecue has already happened');
    }

    return this.barbecueRSVPRepository.delete(barbecueRSVP);
  }
}

export default DeleteBarbecueRSVPService;
