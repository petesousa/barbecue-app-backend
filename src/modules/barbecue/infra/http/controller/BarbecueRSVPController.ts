import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import UpdateBarbecueRSVPDetailsService from '@modules/barbecue/service/UpdateBarbecueRSVPDetailsService';
import ToggleBarbecueRSVPService from '@modules/barbecue/service/ToggleBarbecueRSVPService';
import ToggleBarbecueRSVPHasPaidService from '@modules/barbecue/service/ToggleBarbecueRSVPHasPaidService';
import DeleteBarbecueRSVPService from '@modules/barbecue/service/DeleteBarbecueRSVPService';

class BarbecueRSVPController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { barbecueId, willDrink, willEat } = request.body;
    const createBarbecueRSVP = container.resolve(CreateBarbecueRSVPService);
    const barbecueRSVP = await createBarbecueRSVP.run({
      barbecueId,
      userId: request.user.id,
      willDrink,
      willEat,
      rsvp: true,
      hasPaid: false,
    });

    return response.json(barbecueRSVP);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { barbecueRSVPId, willEat, willDrink } = request.body;
    const updateBarbecueRSVP = container.resolve(
      UpdateBarbecueRSVPDetailsService,
    );
    const barbecueRSVP = await updateBarbecueRSVP.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
      willDrink,
      willEat,
    });

    return response.json(barbecueRSVP);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const deleteBarbecueRSVP = container.resolve(DeleteBarbecueRSVPService);
    const barbecueRSVP = await deleteBarbecueRSVP.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecueRSVP);
  }

  public async toggleHasPaid(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const toggleBarbecueRSVPHasPaid = container.resolve(
      ToggleBarbecueRSVPHasPaidService,
    );
    const barbecueRSVP = await toggleBarbecueRSVPHasPaid.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecueRSVP);
  }
}

export default BarbecueRSVPController;
