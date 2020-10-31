import { Router } from 'express';

import SessionController from '@modules/user/http/controller/SessionController';

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.post('/', sessionController.create);

export default sessionRouter;
