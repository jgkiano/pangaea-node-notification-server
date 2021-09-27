import { IsNotEmpty, IsAlphanumeric, IsUrl } from 'class-validator';

export class SubscriptionParamDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  topic: string;
}

export class SubscriptionBodyDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
