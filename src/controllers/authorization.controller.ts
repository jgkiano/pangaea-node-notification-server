import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateApiKeyDto } from '../models/GenerateApiKeyDto';
import { v4 as uuidv4 } from 'uuid';
import { ApiKeyCreationGuard } from '../guards/apiKeyCreationGuard';

@Controller()
@UseGuards(ApiKeyCreationGuard)
export class AuthorizationController {
  @Post('/generate-api-key')
  generateApiKey(@Body() credentials: GenerateApiKeyDto) {
    return { apiKey: uuidv4() };
  }
}
