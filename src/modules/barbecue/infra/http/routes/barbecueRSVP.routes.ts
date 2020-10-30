import { Router } from 'express';

import ensureAuthenticated from '@modules/user/infra/http/middlewares/ensureAuthenticated';

import BarbecueRSVPController from '../controller/BarbecueRSVPController';

const barbecueRSVPRouter = Router();
barbecueRSVPRouter.use(ensureAuthenticated);
const barbecueRSVPController = new BarbecueRSVPController();

barbecueRSVPRouter.post('/', barbecueRSVPController.create);

export default barbecueRSVPRouter;
