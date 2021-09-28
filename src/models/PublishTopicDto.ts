import { IsAlphanumeric } from 'class-validator';

export class PublishTopicParamDto {
  @IsAlphanumeric()
  topic: string;
}

export class PublishTopicBodyDto {
  [key: string]: any;
}
