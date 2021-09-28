import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DBService } from '../services/db.service';
import { AuthRequest } from '../types/';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const apiKey = request.headers.authorization || '';
    if (await this.dbService.isValidApiKey(apiKey)) {
      return true;
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
