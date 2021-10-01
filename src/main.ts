import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DBService } from './services/db.service';
import { SubscriberModule } from './external_subscriber/subscriber.module';

const PUBLISHER_SERVER_PORT = process.env.NODE_PORT || 8000;
const SUBSCRIBER_SERVER_PORT = process.env.SUBSCRIBER_NODE_PORT || 9000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const subscriberApp = await NestFactory.create(SubscriberModule);
  app.useGlobalPipes(new ValidationPipe());
  subscriberApp.useGlobalPipes(new ValidationPipe());
  try {
    await DBService.initalize();
    await app.listen(PUBLISHER_SERVER_PORT);
    console.log(`started publisher server on port: ${PUBLISHER_SERVER_PORT}`);
    await subscriberApp.listen(SUBSCRIBER_SERVER_PORT);
    console.log(`started subscriber server on port: ${SUBSCRIBER_SERVER_PORT}`);
    process.on('exit', async () => {
      await DBService.quit();
      await subscriberApp.close();
      await app.close();
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
