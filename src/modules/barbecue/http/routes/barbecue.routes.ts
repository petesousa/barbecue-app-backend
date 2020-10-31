import { Router } from 'express';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';

import BarbecueController from '../controller/BarbecueController';

const barbecueRouter = Router();
barbecueRouter.use(ensureAuthenticated);
const barbecueController = new BarbecueController();

// barbecueRouter.get('/', async (request, response) => {
//   const barbecues = await barbecueRepository.find();

//   return response.json(barbecues);
// });

barbecueRouter.post('/', barbecueController.create);

export default barbecueRouter;
