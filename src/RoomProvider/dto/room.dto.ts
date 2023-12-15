import { IsNumberString, IsString } from 'class-validator';

export class RoomDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumberString()
  price: string;

  @IsString()
  image: string;
}
