import {
  Controller,
  Param,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';
import {
  SubscriptionBodyDto,
  SubscriptionParamDto,
} from '../models/SubscriptionDto';
import { DBService } from '../services/db.service';
import { SubscriptionToTopicSuccessResponse } from '../types';

@Controller('subscribe')
@UseGuards(AuthorizationGuard)
export class SubscriptionController {
  constructor(private readonly dbService: DBService) {}

  @Post(':topic')
  async subscribe(
    @Param() params: SubscriptionParamDto,
    @Body() body: SubscriptionBodyDto,
    @Headers() headers: { authorization: string },
  ): Promise<SubscriptionToTopicSuccessResponse> {
    return this.dbService.subscribeTopic({
      topic: params.topic,
      url: body.url,
      apiKey: headers.authorization,
    });
  }
}