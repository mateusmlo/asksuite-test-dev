import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { TimeframeDTO } from './RoomProvider/dto/timeframe.dto';
import { RoomService } from './RoomProvider/room.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { RoomDTO } from './RoomProvider/dto/room.dto';

@Controller()
export class AppController {
  constructor(private readonly roomService: RoomService) {}

  @ApiBadRequestResponse({
    type: BadRequestException,
    description:
      'provided with invalid timeframes such as dates in the past or check-out before check-in',
  })
  @ApiCreatedResponse({
    type: RoomDTO,
    description: 'information on available rooms for provided timeframe',
  })
  @ApiBody({ type: TimeframeDTO })
  @Post('/search')
  searchRoomsForTimeframe(@Body() timeframeDto: TimeframeDTO) {
    return this.roomService.searchRooms(timeframeDto);
  }
}
