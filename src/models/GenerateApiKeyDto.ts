import { IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class GenerateApiKeyDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;
}
