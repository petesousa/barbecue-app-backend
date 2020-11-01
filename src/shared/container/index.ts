import { container } from 'tsyringe';

import '@modules/user/providers';
import 'shared/providers';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import BarbecueRepositoryImpl from '@modules/barbecue/repository/implementation/BarbecueRepositoryImpl';

import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import BarbecueRSVPRepositoryImpl from '@modules/barbecue/repository/implementation/BarbecueRSVPRepositoryImpl';

import UserRepository from '@modules/user/repository/UserRepository';
import UserRepositoryImpl from '@modules/user/repository/implementation/UserRepositoryImpl';

container.registerSingleton<BarbecueRepository>(
  'BarbecueRepository',
  BarbecueRepositoryImpl,
);

container.registerSingleton<BarbecueRSVPRepository>(
  'BarbecueRSVPRepository',
  BarbecueRSVPRepositoryImpl,
);

container.registerSingleton<UserRepository>(
  'UserRepository',
  UserRepositoryImpl,
);
