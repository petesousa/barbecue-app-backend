import { Router } from 'express';

import ensureAuthenticated from '@modules/user/http/middlewares/ensureAuthenticated';

import BarbecueRSVPController from '@modules/barbecue/http/controller/BarbecueRSVPController';

const barbecueRSVPRouter = Router();
barbecueRSVPRouter.use(ensureAuthenticated);
const barbecueRSVPController = new BarbecueRSVPController();

barbecueRSVPRouter.post('/', barbecueRSVPController.create);
barbecueRSVPRouter.delete('/:rsvpId', barbecueRSVPController.delete);
barbecueRSVPRouter.put('/:rsvpId/meal', barbecueRSVPController.meal);
barbecueRSVPRouter.put('/:rsvpId/drinks', barbecueRSVPController.drinks);
barbecueRSVPRouter.put('/:rsvpId/paid', barbecueRSVPController.paid);

export default barbecueRSVPRouter;
