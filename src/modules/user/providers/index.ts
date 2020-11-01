import { container } from 'tsyringe';

import HashProvider from './HashProvider/model/HashProvider';
import BCryptHashProvider from './HashProvider/implementation/BCryptHashProvider';

import JWTProvider from './JWTProvider/model/JWTProvider';
import DefaultJWTProvider from './JWTProvider/implementation/DefaultJWTProvider';

container.registerSingleton<HashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<JWTProvider>('JWTProvider', DefaultJWTProvider);
