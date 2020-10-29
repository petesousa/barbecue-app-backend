import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import BarbecueRepository from '../repository/BarbecueRepository';
import CreateBarbecueService from '../service/CreateBarbecueService';

const barbecueRouter = Router();
barbecueRouter.use(ensureAuthenticated);

barbecueRouter.get('/', async (request, response) => {
  const barbecueRepository = getCustomRepository(BarbecueRepository);
  const barbecues = await barbecueRepository.find();

  return response.json(barbecues);
});

barbecueRouter.post('/', async (request, response) => {
  const { organizerId, date } = request.body;
  const parsedDate = parseISO(date);

  const createBarbecue = new CreateBarbecueService();
  const barbecue = await createBarbecue.run({
    organizerId,
    date: parsedDate,
  });

  return response.json(barbecue);
});

export default barbecueRouter;
