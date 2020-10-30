import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';

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
}

export default BarbecueRSVPController;
