import { Body, Controller, Post } from '@nestjs/common';
import { TimeframeDTO } from './RoomProvider/dto/timeframe.dto';
import { RoomService } from './RoomProvider/room.service';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/search')
  searchRoomsForTimeframe(@Body() timeframeDto: TimeframeDTO) {
    return this.roomService.searchRooms(timeframeDto);
  }
}
