import { Body, Controller, Post } from '@nestjs/common';
import { GenerateApiKeyDto } from '../models/GenerateApiKeyDto';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class AuthorizationController {
  @Post('/generate-api-key')
  generateApiKey(@Body() credentials: GenerateApiKeyDto) {
    return { apiKey: uuidv4() };
  }
}
