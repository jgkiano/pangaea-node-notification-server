import { IsAlphanumeric } from 'class-validator';

export class GenerateApiKeyDto {
  @IsAlphanumeric()
  username: string;
}
