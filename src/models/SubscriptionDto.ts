import { IsAlphanumeric, IsUrl } from 'class-validator';

export class SubscriptionParamDto {
  @IsAlphanumeric()
  topic: string;
}

export class SubscriptionBodyDto {
  @IsUrl()
  url: string;
}
