import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { DBService } from '../services/db.service';

@Injectable()
export class PublishGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

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
