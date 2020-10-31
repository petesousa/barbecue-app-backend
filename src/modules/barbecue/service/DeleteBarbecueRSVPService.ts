import GenericError from '@shared/errors/GenericError';
import { injectable, inject } from 'tsyringe';

import { isBefore, startOfDay } from 'date-fns';
import { DeleteResult } from 'typeorm';

import DeleteBarbecueRSVPDTO from '@modules/barbecue/dto/DeleteBarbecueRSVPDTO';
import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';

@injectable()
class DeleteBarbecueRSVPService {
  constructor(
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,

    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
  ) {}

  public async run({
    barbecueRSVPId,
    loggedInUserId,
  }: DeleteBarbecueRSVPDTO): Promise<DeleteResult> {
    const barbecueRSVP = await this.barbecueRSVPRepository.findById(
      barbecueRSVPId,
    );
    if (!barbecueRSVP) {
      throw new GenericError('Barbecue RSVP does not exist');
    }

    if (barbecueRSVP.userId !== loggedInUserId) {
      throw new GenericError('Barbecue RSVP does not belong to this user');
    }

    const barbecue = await this.barbecueRepository.findById(
      barbecueRSVP.barbecueId,
    );

    if (!barbecue) {
      throw new GenericError('Barbecue does not exist');
    }

    if (isBefore(startOfDay(new Date(barbecue.date)), startOfDay(new Date()))) {
      throw new GenericError('Barbecue has already happened');
    }

    return this.barbecueRSVPRepository.delete(barbecueRSVP);
  }
}

export default DeleteBarbecueRSVPService;
