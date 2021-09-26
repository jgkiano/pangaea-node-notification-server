import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { TopicDto } from '../models/TopicDto';

@Controller('publish')
@UseGuards(AuthorizationGuard)
export class PublishController {
  @Post(':topic')
  publish(@Param() params: TopicDto): { message: string } {
    return { message: params.topic };
  }
}
