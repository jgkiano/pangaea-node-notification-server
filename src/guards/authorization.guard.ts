import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import validator from 'validator';
import { DBService } from '../services/db.service';

type AuthRequest = {
  headers: { authorization?: string };
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const apiKey = request.headers.authorization || '';
    if (this.dbService.isApiKeyValid(apiKey)) {
      return true;
    }
    throw new HttpException('Unauthorized', 401);
  }
}
