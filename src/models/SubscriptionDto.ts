import { IsAlphanumeric, IsUrl } from 'class-validator';

export class SubscriptionParamDto {
  @IsAlphanumeric()
  topic: string;
}

export class SubscriptionBodyDto {
  @IsUrl({
    allow_protocol_relative_urls: true,
    allow_underscores: true,
    allow_trailing_dot: true,
    require_tld: false,
  })
  url: string;
}
