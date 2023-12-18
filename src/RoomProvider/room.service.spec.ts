import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { mockRoom } from './mock/room.mock';
import 'jest-puppeteer';
import 'expect-puppeteer';
import { BadRequestException } from '@nestjs/common';

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService],
    }).compile();

    roomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(roomService).toBeDefined();
  });

  describe('searchRooms', () => {
    it("should return a room's information", async () => {
      const room = await roomService.searchRooms({
        checkin: '2024-02-17',
        checkout: '2024-02-20',
      });

      expect(room[0]).toEqual(mockRoom);
    }, 10000);

    it('should return empty array if no rooms available', async () => {
      jest.spyOn(roomService, 'searchRooms').mockResolvedValue([]);

      const noRooms = await roomService.searchRooms({
        checkin: '2023-12-27',
        checkout: '2023-12-28',
      });

      expect(noRooms).toEqual([]);
      expect(noRooms.length).toEqual(0);
    });

    it('should throw if timeframe is in the past', async () => {
      const room = roomService.searchRooms({
        checkin: '2022-02-17',
        checkout: '2022-02-20',
      });

      await expect(room).rejects.toThrow(
        new BadRequestException(
          'Check-in or check-out dates cannot be in the past',
        ),
      );
    });

    it('should throw if check-out date is before check-in', async () => {
      const room = roomService.searchRooms({
        checkin: '2024-02-17',
        checkout: '2024-01-20',
      });

      await expect(room).rejects.toThrow(
        new BadRequestException('Check-out date cannot be before the check-in'),
      );
    });
  });
});
