import { IsNotEmpty, IsAlphanumeric } from 'class-validator';

export class PublishTopicParamDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  topic: string;
}

export class PublishTopicBodyDto {
  [key: string]: any;
}
