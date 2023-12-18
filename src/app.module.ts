import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoomModule } from './RoomProvider/room.module';

@Module({
  imports: [RoomModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
