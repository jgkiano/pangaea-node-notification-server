import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from '../guards/authorization.guard';

@Controller('subscribe')
@UseGuards(AuthorizationGuard)
export class SubscriptionController {
  @Post()
  subscribe(): { message: string } {
    return { message: 'Hey there' };
  }
}
