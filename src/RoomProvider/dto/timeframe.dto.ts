import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class TimeframeDTO {
  @IsDateString({}, { message: 'Date format must be yyyy/dd/mm' })
  @ApiProperty({ example: '2023-01-24' })
  checkin: string;

  @IsDateString({}, { message: 'Date format must be yyyy/dd/mm' })
  @ApiProperty({ example: '2023-01-24' })
  checkout: string;
}
