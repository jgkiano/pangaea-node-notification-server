import { Controller, Get } from '@nestjs/common';
import { SuccessPingResponse } from '../types';

@Controller()
export class SubscriberController {
  @Get()
  ping(): SuccessPingResponse {
    return { message: 'Subscriber API live! 🕺' };
  }
}
