import { Controller, Post } from '@nestjs/common';

@Controller()
export class AuthorizationController {
  @Post('/generate-api-key')
  generateApiKey(): { message: string } {
    return { message: 'Hey there' };
  }
}
