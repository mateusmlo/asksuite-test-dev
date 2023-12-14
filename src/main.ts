import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.APP_PORT, async () => {
    logger.log(`App running at ${await app.getUrl()}`);
  });
}

bootstrap();
