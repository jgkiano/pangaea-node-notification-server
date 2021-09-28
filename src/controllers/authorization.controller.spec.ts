import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller';
import { DBService } from '../services/db.service';
import { v4 as uuidv4 } from 'uuid';
import { GenerateApiKeySuccessResponse } from '../types';

const mockDBService = {
  createApiKey: jest.fn(() => {
    return uuidv4();
  }),
};

describe('AuthorizationController', () => {
  let authorizationController: AuthorizationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [DBService],
    })
      .overrideProvider(DBService)
      .useValue(mockDBService)
      .compile();
    authorizationController = app.get<AuthorizationController>(
      AuthorizationController,
    );
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(authorizationController).toBeDefined();
    });
    it('should generate an api key with correct response', async () => {
      const result = await authorizationController.generateApiKey({
        username: 'kiano',
      });
      expect(result).toEqual<GenerateApiKeySuccessResponse>({
        apiKey: expect.any(String),
      });
    });
  });
});
