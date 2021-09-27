import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
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
    throw new UnauthorizedException('Unauthorized');
  }
}
