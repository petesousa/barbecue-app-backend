import GenericError from '@shared/errors/GenericError';
import MockBarbecueRepository from '../repository/mock/MockBarbecueRepository';

import CreateBarbecueService from './CreateBarbecueService';

describe('CreateBarbecue', () => {
  it('should be able to create a new barbecue', async () => {
    const mockBarbecueRepository = new MockBarbecueRepository();
    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);
    const barbecue = await createBarbecue.run({
      date: new Date(),
      organizerId: '98234987',
    });
    expect(barbecue).toHaveProperty('id');
    expect(barbecue.organizerId).toBe('98234987');
  });

  it('should not be able to create two barbecues on the same day', async () => {
    const mockBarbecueRepository = new MockBarbecueRepository();
    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);

    const barbecueDate = new Date();

    await createBarbecue.run({
      date: barbecueDate,
      organizerId: '98234987',
    });

    expect(
      createBarbecue.run({
        date: barbecueDate,
        organizerId: '98234987',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });

  it('should not be able to create a barbecue on an invalid date', async () => {
    const mockBarbecueRepository = new MockBarbecueRepository();
    const createBarbecue = new CreateBarbecueService(mockBarbecueRepository);

    const barbecueDate = new Date('2020-11-34T14:00:00.000Z');
    expect(
      createBarbecue.run({
        date: barbecueDate,
        organizerId: '98234987',
      }),
    ).rejects.toBeInstanceOf(GenericError);
  });
});
