import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import ToggleBarbecueRSVPService from '@modules/barbecue/service/ToggleBarbecueRSVPService';

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

  public async toggle(request: Request, response: Response): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const toggleBarbecueRSVP = container.resolve(ToggleBarbecueRSVPService);
    const barbecueRSVP = await toggleBarbecueRSVP.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecueRSVP);
  }
}

export default BarbecueRSVPController;
