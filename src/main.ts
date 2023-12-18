import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Room search endpoint')
    .setVersion('1.0')
    .addTag('asksuite')
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.APP_PORT, async () => {
    logger.log(`⭐️ App running at ${await app.getUrl()}`);
  });
}

bootstrap();
