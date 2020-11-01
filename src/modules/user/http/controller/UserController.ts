import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/user/service/CreateUserService';

class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.run({
      username,
      password,
    });

    return response.json({ data: user });
  }
}

export default UserController;
