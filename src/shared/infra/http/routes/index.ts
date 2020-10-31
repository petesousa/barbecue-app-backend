import { Router } from 'express';
import barbecueRouter from '@modules/barbecue/http/routes/barbecue.routes';
import userRouter from '@modules/user/infra/http/routes/user.routes';
import sessionRouter from '@modules/user/infra/http/routes/session.routes';
import barbecueRSVPRouter from '@modules/barbecue/http/routes/barbecueRSVP.routes';

const routes = Router();

routes.use('/barbecue', barbecueRouter);
routes.use('/barbecue-rsvp', barbecueRSVPRouter);
routes.use('/user', userRouter);
routes.use('/session', sessionRouter);

export default routes;
