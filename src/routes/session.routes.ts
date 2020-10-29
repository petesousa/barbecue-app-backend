import { Router } from 'express';
import LoginUserService from '../service/LoginUserService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const loginUser = new LoginUserService();

  const loginResponse = await loginUser.run({
    username,
    password,
  });

  return response.json(loginResponse);
});

export default sessionRouter;
