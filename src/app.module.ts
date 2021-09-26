import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublishController } from './controllers/publish.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { AuthorizationController } from './controllers/authorization.controller';
import { DBService } from './services/db.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    PublishController,
    SubscriptionController,
    AuthorizationController,
  ],
  providers: [AppService, DBService],
})
export class AppModule {}
