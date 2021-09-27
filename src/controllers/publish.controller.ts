import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { PublishGuard } from '../guards/publish.guard';
import {
  PublishTopicParamDto,
  PublishTopicBodyDto,
} from '../models/PublishTopicDto';

@Controller('publish')
@UseGuards(AuthorizationGuard)
@UseGuards(PublishGuard)
export class PublishController {
  @Post(':topic')
  publish(
    @Param() params: PublishTopicParamDto,
    @Body() body: PublishTopicBodyDto,
  ) {
    return { topc: params.topic, body };
  }
}
