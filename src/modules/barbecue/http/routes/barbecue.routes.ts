import { Router } from 'express';

import ensureAuthenticated from '@modules/user/http/middlewares/ensureAuthenticated';

import BarbecueController from '@modules/barbecue/http/controller/BarbecueController';

const barbecueRouter = Router();
barbecueRouter.use(ensureAuthenticated);
const barbecueController = new BarbecueController();

barbecueRouter.post('/', barbecueController.create);
// barbecueRouter.get('/?:month', barbecueController.getBarbecueCalendar);
barbecueRouter.get('/:barbecueId', barbecueController.getDetails);

export default barbecueRouter;
