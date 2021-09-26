import { Controller, Post } from '@nestjs/common';

@Controller()
export class SubscriptionController {
  @Post('/subscribe')
  subscribe(): { message: string } {
    return { message: 'Hey there' };
  }
}
