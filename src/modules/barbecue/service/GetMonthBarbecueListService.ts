import { injectable, inject } from 'tsyringe';

import GetMonthBarbecueListRequestDTO from '@modules/barbecue/dto/GetMonthBarbecueListRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import CalendarDayContentDTO from '@modules/barbecue/dto/CalendarDayContentDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import ListUserService from '@modules/user/service/ListUserService';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';
import UserRepository from '@modules/user/repository/UserRepository';
import InvalidMonthException from '@shared/exception/InvalidMonthException';
import { isAfter } from 'date-fns';
import BeforeStartOfTimeException from '../exception/BeforeStartOfTimeException';

@injectable()
class GetMonthBarbecueListService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
    @inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  public async run({
    month,
    year,
    loggedInUserId,
  }: GetMonthBarbecueListRequestDTO): Promise<CalendarDayContentDTO[]> {
    const listUsers = new ListUserService(this.userRepository);
    const allUsers = await listUsers.run();
    const users: Map<string, string> = new Map<string, string>();
    allUsers.forEach(user => {
      users.set(user.userId, user.username);
    });

    if (month > 12 || month < 1) throw new InvalidMonthException();
    if (year < 2020) throw new BeforeStartOfTimeException();

    const daysInMonth = this.dateProvider.daysInMonth(year, month);

    const barbecues = await this.barbecueRepository.listByMonth(month, year);

    const daysArray = this.dateProvider.daysInMonthArray(daysInMonth);

    const monthCalendar = daysArray.map(async day => {
      const findBarbecue = barbecues.filter(each =>
        this.dateProvider.isTheSameDay(each.date, day),
      );
      let barbecue;
      if (findBarbecue.length > 0) {
        const {
          id,
          mealPrice,
          drinksPrice,
          date,
          hour,
          title,
          organizerId,
        } = findBarbecue[0];
        const lowerPrice = mealPrice >= drinksPrice ? drinksPrice : mealPrice;
        const rsvpList = await this.barbecueRSVPRepository.findByBarbecueId(id);
        let rsvp = 0;
        if (rsvpList && rsvpList.length > 0) {
          rsvp = rsvpList.length;
        }
        const noRSVP = allUsers.length - rsvp;

        barbecue = {
          id,
          organizer: users.get(organizerId),
          date,
          hour,
          title,
          priceRange: {
            from: lowerPrice,
            to: mealPrice + drinksPrice,
          },
          rsvp: {
            yes: rsvp,
            no: noRSVP,
          },
          isOrganizerLoggedIn: loggedInUserId === organizerId,
        };
      }

      const isDateAvailable = isAfter(
        new Date(year, month - 1, day, 23, 59, 59),
        new Date(),
      );
      return {
        day,
        barbecue,
        isDateAvailable,
      };
    });

    return Promise.all(monthCalendar);
  }
}

export default GetMonthBarbecueListService;
