import { Router } from 'express';

import SessionController from '../controller/SessionController';

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.post('/', sessionController.create);

export default sessionRouter;
