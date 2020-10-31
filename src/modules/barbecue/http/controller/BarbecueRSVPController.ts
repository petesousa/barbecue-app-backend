import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueRSVPService from '@modules/barbecue/service/CreateBarbecueRSVPService';
import ToggleBarbecueRSVPWillEatService from '@modules/barbecue/service/ToggleBarbecueRSVPWillEatService';
import ToggleBarbecueRSVPHasPaidService from '@modules/barbecue/service/ToggleBarbecueRSVPHasPaidService';
import DeleteBarbecueRSVPService from '@modules/barbecue/service/DeleteBarbecueRSVPService';
import ToggleBarbecueRSVPWillDrinkService from '@modules/barbecue/service/ToggleBarbecueRSVPWillDrinkService';

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

  public async delete(request: Request, response: Response): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const deleteBarbecueRSVP = container.resolve(DeleteBarbecueRSVPService);
    const deleteResult = await deleteBarbecueRSVP.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(deleteResult);
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

  public async toggleWillEat(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const toggleBarbecueRSVPWillEat = container.resolve(
      ToggleBarbecueRSVPWillEatService,
    );
    const barbecueRSVP = await toggleBarbecueRSVPWillEat.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecueRSVP);
  }

  public async toggleWillDrink(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { barbecueRSVPId } = request.body;
    const toggleBarbecueRSVPWillDrink = container.resolve(
      ToggleBarbecueRSVPWillDrinkService,
    );
    const barbecueRSVP = await toggleBarbecueRSVPWillDrink.run({
      barbecueRSVPId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecueRSVP);
  }
}

export default BarbecueRSVPController;