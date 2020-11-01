/* eslint-disable no-console */
import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import GenericException from '@shared/exception/GenericException';
import DateException from '@shared/exception/DateException';
import UserException from '@modules/user/exception/UserException';
import BarbecueException from '@modules/barbecue/exception/BarbecueException';

import routes from './routes';

import '@shared/container';
import '@shared/database/typeorm';

const app = express();
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (
    err instanceof GenericException ||
    err instanceof DateException ||
    err instanceof UserException ||
    err instanceof BarbecueException
  ) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3333);
