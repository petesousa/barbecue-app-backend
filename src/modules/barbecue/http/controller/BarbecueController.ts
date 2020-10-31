import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';
import GetBarbecueDetailsService from '@modules/barbecue/service/GetBarbecueDetailsService';

class BarbecueController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      date,
      hour,
      title,
      description,
      mealPrice,
      drinksPrice,
    } = request.body;

    const parsedDate = parseISO(date);
    const createBarbecue = container.resolve(CreateBarbecueService);
    const barbecue = await createBarbecue.run({
      organizerId: request.user.id,
      date: parsedDate,
      hour,
      title,
      description,
      mealPrice,
      drinksPrice,
    });

    return response.json(barbecue);
  }

  public async getDetails(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { barbecueId } = request.params;

    const getBarbecueDetails = container.resolve(GetBarbecueDetailsService);
    const barbecue = await getBarbecueDetails.run({
      barbecueId,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecue);
  }
}

export default BarbecueController;
