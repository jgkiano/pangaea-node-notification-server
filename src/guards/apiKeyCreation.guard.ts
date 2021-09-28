import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { DBService } from '../services/db.service';
import { ApiKeyCreationRequest } from '../types';

@Injectable()
export class ApiKeyCreationGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const body = context.switchToHttp().getRequest()
        .body as ApiKeyCreationRequest;
      const isExistingUser = await this.dbService.isExistingUser(body.username);
      if (isExistingUser) throw new ConflictException('user already exists');
      return !isExistingUser;
    } catch (error) {
      throw error;
    }
  }
}
