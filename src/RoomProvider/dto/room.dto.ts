import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class RoomDTO {
  @ApiProperty({ example: 'Cozy room' })
  @IsString()
  name: string;

  @IsString()
  @ApiProperty({ example: 'A small, clean and nice room' })
  description: string;

  @IsNumberString()
  @ApiProperty({ example: 'R$ 9800' })
  price: string;

  @IsString()
  @ApiProperty({ example: 'https://image.cdn.example/23089210.jpg' })
  image: string;
}
