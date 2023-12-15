import { IsDateString } from 'class-validator';

export class TimeframeDTO {
  @IsDateString({}, { message: 'Date format must be yyyy/dd/mm' })
  checkin: string;

  @IsDateString({}, { message: 'Date format must be yyyy/dd/mm' })
  checkout: string;
}
