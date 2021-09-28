import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DBService } from './services/db.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  try {
    await DBService.initalize();
    await app.listen(process.env.NODE_PORT || 3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
