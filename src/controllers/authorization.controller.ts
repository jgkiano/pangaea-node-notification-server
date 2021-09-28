import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GenerateApiKeyDto } from '../models/GenerateApiKeyDto';
import { ApiKeyCreationGuard } from '../guards/apiKeyCreation.guard';
import { DBService } from '../services/db.service';
import { GenerateApiKeySuccessResponse } from '../types';

@Controller()
@UseGuards(ApiKeyCreationGuard)
export class AuthorizationController {
  constructor(private readonly dbService: DBService) {}

  @Post('/generate-api-key')
  async generateApiKey(
    @Body() credentials: GenerateApiKeyDto,
  ): Promise<GenerateApiKeySuccessResponse> {
    return {
      apiKey: await this.dbService.createApiKey(credentials.username),
    };
  }
}
