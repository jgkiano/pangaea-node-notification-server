import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';

@Controller('publish')
@UseGuards(AuthorizationGuard)
export class PublishController {
  @Post()
  publish(): { message: string } {
    return { message: 'Hey there' };
  }
}
