import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PublishGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    if (this.isObject(request.body)) {
      return true;
    }
    throw new BadRequestException('request body must be a json object');
  }

  private isObject(value: unknown) {
    return value != null && typeof value === 'object' && !Array.isArray(value);
  }
}
