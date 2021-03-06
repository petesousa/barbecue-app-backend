import { addHours, endOfDay, parseISO, startOfDay } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';
import GetBarbecueDetailsService from '@modules/barbecue/service/GetBarbecueDetailsService';
import GetMonthBarbecueListService from '@modules/barbecue/service/GetMonthBarbecueListService';
import GetBarbecueByDateService from '@modules/barbecue/service/GetBarbecueByDateService';

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

    const createBarbecue = container.resolve(CreateBarbecueService);
    const barbecue = await createBarbecue.run({
      organizerId: request.user.id,
      date: parseISO(date),
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

  public async listByMonth(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { month, year } = request.query;

    const getMonthBarbecueList = container.resolve(GetMonthBarbecueListService);
    const barbecues = await getMonthBarbecueList.run({
      month: Number(month),
      year: Number(year),
      loggedInUserId: request.user.id,
    });

    return response.json(barbecues);
  }

  public async getByDate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { date } = request.params;

    const parsedDate = startOfDay(addHours(new Date(date), 3));

    const getBarbecueByDate = container.resolve(GetBarbecueByDateService);
    const barbecues = await getBarbecueByDate.run({
      date: parsedDate,
      loggedInUserId: request.user.id,
    });

    return response.json(barbecues);
  }
}

export default BarbecueController;
