import { Router } from 'express';

import ensureAuthenticated from '@modules/user/http/middlewares/ensureAuthenticated';

import BarbecueRSVPController from '@modules/barbecue/http/controller/BarbecueRSVPController';

const barbecueRSVPRouter = Router();
barbecueRSVPRouter.use(ensureAuthenticated);
const barbecueRSVPController = new BarbecueRSVPController();

barbecueRSVPRouter.post('/', barbecueRSVPController.create);
barbecueRSVPRouter.delete('/', barbecueRSVPController.delete);
barbecueRSVPRouter.put(
  '/toggle-will-eat',
  barbecueRSVPController.toggleWillEat,
);
barbecueRSVPRouter.put(
  '/toggle-will-drink',
  barbecueRSVPController.toggleWillEat,
);
barbecueRSVPRouter.put(
  '/toggle-has-paid',
  barbecueRSVPController.toggleHasPaid,
);

export default barbecueRSVPRouter;
