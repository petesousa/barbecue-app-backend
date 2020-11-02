import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionService from '@modules/user/service/CreateSessionService';

class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const createSession = container.resolve(CreateSessionService);

    const session = await createSession.run({
      username,
      password,
    });

    return response.json(session);
  }
}

export default SessionController;
