import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
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
  providers: [DBService],
})
export class AppModule {}
