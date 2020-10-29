/* eslint-disable no-console */
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import './database';
import routes from './routes';

import GenericError from './errors/GenericError';

const app = express();
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof GenericError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

app.listen(3333, () => {
  console.log('Server started');
});
