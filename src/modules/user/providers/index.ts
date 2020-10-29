import { container } from 'tsyringe';

import IHashProvider from './HashProvider/model/IHashProvider';
import BCryptHashProvider from './HashProvider/implementation/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
