import { IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class GenerateApiKeyDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  topic: string;
}
