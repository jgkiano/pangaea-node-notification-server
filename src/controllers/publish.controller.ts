import { Controller, Post } from '@nestjs/common';

@Controller()
export class PublishController {
  @Post('/publish')
  publish(): { message: string } {
    return { message: 'Hey there' };
  }
}
