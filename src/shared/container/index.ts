import { container } from 'tsyringe';

import '@modules/user/providers';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRepositoryImpl from '@modules/barbecue/repository/implementation/BarbecueRepositoryImpl';

import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueRSVPRepositoryImpl from '@modules/barbecue/repository/implementation/BarbecueRSVPRepositoryImpl';

import IUserRepository from '@modules/user/repository/IUserRepository';
import UserRepository from '@modules/user/infra/typeorm/repository/UserRepository';

container.registerSingleton<BarbecueRepository>(
  'BarbecueRepository',
  BarbecueRepositoryImpl,
);

container.registerSingleton<BarbecueRSVPRepository>(
  'BarbecueRSVPRepository',
  BarbecueRSVPRepositoryImpl,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
