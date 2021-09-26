import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import validator from 'validator';

type AuthRequest = {
  headers: { authorization?: string };
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: AuthRequest = context.switchToHttp().getRequest();
    const apiKey = request.headers.authorization || '';
    if (validator.isUUID(apiKey)) {
      return true;
    }
    throw new HttpException('Unauthorized', 401);
  }
}
