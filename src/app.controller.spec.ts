import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './RoomProvider/room.service';
import { AppController } from './app.controller';
import { mockRoom } from './RoomProvider/mock/room.mock';

describe('AppController', () => {
  let controller: AppController;
  let roomService: Pick<jest.MockedObject<RoomService>, 'searchRooms'>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: RoomService,
          useValue: {
            searchRooms: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AppController);
    roomService = module.get(RoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(roomService).toBeDefined();
  });

  describe('searchRooms', () => {
    it('should return available rooms information', async () => {
      roomService.searchRooms.mockResolvedValueOnce([mockRoom]);

      await expect(
        controller.searchRoomsForTimeframe({
          checkin: '2024-02-17',
          checkout: '2024-02-20',
        }),
      ).resolves.toEqual([mockRoom]);
    });
  });
});
