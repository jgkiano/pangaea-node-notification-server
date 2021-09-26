import { IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class TopicDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  topic: string;
}
