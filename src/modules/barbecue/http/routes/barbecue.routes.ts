import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/user/http/middlewares/ensureAuthenticated';

import BarbecueController from '@modules/barbecue/http/controller/BarbecueController';

const barbecueRouter = Router();
barbecueRouter.use(ensureAuthenticated);
const barbecueController = new BarbecueController();

barbecueRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      date: Joi.string().required(),
      hour: Joi.number().integer().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      mealPrice: Joi.number().integer().required(),
      drinksPrice: Joi.number().integer().required(),
    },
  }),
  barbecueController.create,
);

barbecueRouter.get('/by-month', barbecueController.listByMonth);

barbecueRouter.get(
  '/:barbecueId',
  celebrate({
    [Segments.PARAMS]: {
      barbecueId: Joi.string().uuid().required(),
    },
  }),
  barbecueController.getDetails,
);

export default barbecueRouter;
