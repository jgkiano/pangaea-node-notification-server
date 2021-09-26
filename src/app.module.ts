import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublishController } from './controllers/publish.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { AuthorizationController } from './controllers/authorization.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    PublishController,
    SubscriptionController,
    AuthorizationController,
  ],
  providers: [AppService],
})
export class AppModule {}
