import { container, injectable, inject } from 'tsyringe';

import GetMonthBarbecueListRequestDTO from '@modules/barbecue/dto/GetMonthBarbecueListRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import CalendarDayContentDTO from '@modules/barbecue/dto/CalendarDayContentDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import ListUserService from '@modules/user/service/ListUserService';
import DateProvider from '@shared/providers/DateProvider/model/DateProvider';

@injectable()
class GetMonthBarbecueListService {
  constructor(
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
    const listUsers = container.resolve(ListUserService);
    const allUsers = await listUsers.run();
    const users: Map<string, string> = new Map<string, string>();
    allUsers.forEach(user => {
      users.set(user.userId, user.username);
    });

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
      return {
        day,
        barbecue,
      };
    });

    return Promise.all(monthCalendar);
  }
}

export default GetMonthBarbecueListService;