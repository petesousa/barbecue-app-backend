import { container, injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, addHours } from 'date-fns';

import GetMonthBarbecueListRequestDTO from '@modules/barbecue/dto/GetMonthBarbecueListRequestDTO';
import BarbecueRSVPRepository from '@modules/barbecue/repository/BarbecueRSVPRepository';
import CalendarDayContentDTO from '@modules/barbecue/dto/CalendarDayContentDTO';

import BarbecueRepository from '@modules/barbecue/repository/BarbecueRepository';
import UserRepository from '@modules/user/repository/UserRepository';
import ListUserService from '@modules/user/service/ListUserService';

@injectable()
class GetMonthBarbecueListService {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
    @inject('BarbecueRepository')
    private barbecueRepository: BarbecueRepository,
    @inject('BarbecueRSVPRepository')
    private barbecueRSVPRepository: BarbecueRSVPRepository,
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

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const barbecues = await this.barbecueRepository.listByMonth(month, year);

    const daysArray = Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    );

    const monthCalendar = await daysArray.map(async day => {
      const findBarbecue = barbecues.filter(each => {
        //
        const date = addHours(new Date(each.date), 4);
        const dateDay = getDate(date);
        return dateDay === day;
      })[0];
      let barbecue;
      if (findBarbecue) {
        const {
          id,
          mealPrice,
          drinksPrice,
          date,
          hour,
          title,
          organizerId,
        } = findBarbecue;
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
