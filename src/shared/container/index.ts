import { container } from 'tsyringe';

import '@modules/user/providers';

import IBarbecueRepository from '@modules/barbecue/repository/IBarbecueRepository';
import BarbecueRepository from '@modules/barbecue/infra/typeorm/repository/BarbecueRepository';

import IBarbecueRSVPRepository from '@modules/barbecue/repository/IBarbecueRSVPRepository';
import BarbecueRSVPRepository from '@modules/barbecue/infra/typeorm/repository/BarbecueRSVPRepository';

import IUserRepository from '@modules/user/repository/IUserRepository';
import UserRepository from '@modules/user/infra/typeorm/repository/UserRepository';

container.registerSingleton<IBarbecueRepository>(
  'BarbecueRepository',
  BarbecueRepository,
);

container.registerSingleton<IBarbecueRSVPRepository>(
  'BarbecueRSVPRepository',
  BarbecueRSVPRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
