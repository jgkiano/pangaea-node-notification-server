import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
