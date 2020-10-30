import { container } from 'tsyringe';

import IHashProvider from './HashProvider/model/IHashProvider';
import BCryptHashProvider from './HashProvider/implementation/BCryptHashProvider';

import IJWTProvider from './JWTProvider/model/IJWTProvider';
import DefaultJWTProvider from './JWTProvider/implementation/DefaultJWTProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IJWTProvider>('JWTProvider', DefaultJWTProvider);
