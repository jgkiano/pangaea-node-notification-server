import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { DBService } from '../services/db.service';

type ApiKeyCreationRequest = {
  username: string;
};

@Injectable()
export class ApiKeyCreationGuard implements CanActivate {
  constructor(private readonly dbService: DBService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { username }: ApiKeyCreationRequest = context
        .switchToHttp()
        .getRequest().body;
      const isExistingUser = await this.dbService.isExistingUser(username);
      if (isExistingUser) throw new ConflictException('user already exists');
      return !isExistingUser;
    } catch (error) {
      throw error;
    }
  }
}
