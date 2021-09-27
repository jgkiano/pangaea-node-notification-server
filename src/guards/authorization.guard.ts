import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { DBService } from '../services/db.service';

type AuthRequest = {
  headers: { authorization?: string };
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const apiKey = request.headers.authorization || '';
    if (await this.dbService.isValidApiKey(apiKey)) {
      return true;
    }
    throw new HttpException('Unauthorized', 401);
  }
}
