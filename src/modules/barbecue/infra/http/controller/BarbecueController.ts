import { parseISO } from 'date-fns';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateBarbecueService from '@modules/barbecue/service/CreateBarbecueService';

class BarbecueController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { date } = request.body;
    const parsedDate = parseISO(date);

    const createBarbecue = container.resolve(CreateBarbecueService);
    const barbecue = await createBarbecue.run({
      organizerId: request.user.id,
      date: parsedDate,
    });

    return response.json(barbecue);
  }
}

export default BarbecueController;
