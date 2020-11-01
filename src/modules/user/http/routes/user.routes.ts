import { Router } from 'express';

import UserController from '@modules/user/http/controller/UserController';
import { celebrate, Joi, Segments } from 'celebrate';

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

export default userRouter;
