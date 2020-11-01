import { Router } from 'express';

import ensureAuthenticated from '@modules/user/http/middlewares/ensureAuthenticated';

import BarbecueRSVPController from '@modules/barbecue/http/controller/BarbecueRSVPController';
import { celebrate, Joi, Segments } from 'celebrate';

const barbecueRSVPRouter = Router();
barbecueRSVPRouter.use(ensureAuthenticated);
const barbecueRSVPController = new BarbecueRSVPController();

barbecueRSVPRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      barbecueId: Joi.string().uuid().required(),
      willEat: Joi.boolean().required(),
      willDrink: Joi.boolean().required(),
    },
  }),
  barbecueRSVPController.create,
);

barbecueRSVPRouter.delete(
  '/:rsvpId',
  celebrate({
    [Segments.PARAMS]: {
      rsvpId: Joi.string().uuid().required(),
    },
  }),
  barbecueRSVPController.delete,
);

barbecueRSVPRouter.put(
  '/:rsvpId/meal',
  celebrate({
    [Segments.PARAMS]: {
      rsvpId: Joi.string().uuid().required(),
    },
  }),
  barbecueRSVPController.meal,
);

barbecueRSVPRouter.put(
  '/:rsvpId/drinks',
  celebrate({
    [Segments.PARAMS]: {
      rsvpId: Joi.string().uuid().required(),
    },
  }),
  barbecueRSVPController.drinks,
);

barbecueRSVPRouter.put(
  '/:rsvpId/paid',
  celebrate({
    [Segments.PARAMS]: {
      rsvpId: Joi.string().uuid().required(),
    },
  }),
  barbecueRSVPController.paid,
);

export default barbecueRSVPRouter;
