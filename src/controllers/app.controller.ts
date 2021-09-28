import { Controller, Get } from '@nestjs/common';
import { SuccessPingResponse } from '../types';

@Controller()
export class AppController {
  @Get()
  ping(): SuccessPingResponse {
    return { message: 'API live! 🕺' };
  }
}
