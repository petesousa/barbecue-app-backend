import { Router } from 'express';
import CreateUserService from '../service/CreateUserService';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.run({
    username,
    password,
  });

  return response.json(user);
});

export default userRouter;
