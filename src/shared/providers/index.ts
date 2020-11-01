import { container } from 'tsyringe';

import DateProvider from './DateProvider/model/DateProvider';
import DefaultDateProvider from './DateProvider/implementation/DefaultDateProvider';

container.registerSingleton<DateProvider>('DateProvider', DefaultDateProvider);
