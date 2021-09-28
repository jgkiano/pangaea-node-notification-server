import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { PublishGuard } from '../guards/publish.guard';
import {
  PublishTopicParamDto,
  PublishTopicBodyDto,
} from '../models/PublishTopicDto';
import { DBService } from '../services/db.service';
import { PublishToTopicSuccessResponse } from '../types';

@Controller('publish')
@UseGuards(AuthorizationGuard)
@UseGuards(PublishGuard)
export class PublishController {
  constructor(private readonly dbService: DBService) {}

  @Post(':topic')
  publish(
    @Param() params: PublishTopicParamDto,
    @Body() body: PublishTopicBodyDto,
  ): Promise<PublishToTopicSuccessResponse> {
    return this.dbService.publishTopic({ body, topic: params.topic });
  }
}
