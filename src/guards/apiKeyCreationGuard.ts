import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
      return !isExistingUser;
    } catch (error) {
      throw error;
    }
  }
}
