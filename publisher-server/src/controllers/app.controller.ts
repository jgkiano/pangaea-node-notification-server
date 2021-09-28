import { Controller, Get } from '@nestjs/common';

type SuccessPingResponse = {
  message: string;
};

@Controller()
export class AppController {
  @Get()
  ping(): SuccessPingResponse {
    return { message: 'API live! 🕺' };
  }
}
