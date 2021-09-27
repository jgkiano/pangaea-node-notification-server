import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateApiKeyDto } from '../models/GenerateApiKeyDto';
import { ApiKeyCreationGuard } from '../guards/apiKeyCreationGuard';
import { DBService } from '../services/db.service';

@Controller()
@UseGuards(ApiKeyCreationGuard)
export class AuthorizationController {
  constructor(private readonly dbService: DBService) {}

  @Post('/generate-api-key')
  async generateApiKey(@Body() credentials: GenerateApiKeyDto) {
    return {
      apiKey: await this.dbService.createApiKey(credentials.username),
    };
  }
}
