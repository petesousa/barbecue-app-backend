import { container } from 'tsyringe';

import HashProvider from './HashProvider/model/HashProvider';
import BCryptHashProvider from './HashProvider/implementation/BCryptHashProvider';

import IJWTProvider from './JWTProvider/model/IJWTProvider';
import DefaultJWTProvider from './JWTProvider/implementation/DefaultJWTProvider';

container.registerSingleton<HashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IJWTProvider>('JWTProvider', DefaultJWTProvider);
