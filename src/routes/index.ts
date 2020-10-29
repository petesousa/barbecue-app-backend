import { Router } from 'express';
import barbecueRouter from './barbecue.routes';
import userRouter from './user.routes';
import sessionRouter from './session.routes';

const routes = Router();

routes.use('/barbecue', barbecueRouter);
routes.use('/user', userRouter);
routes.use('/session', sessionRouter);

export default routes;
