import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DBService } from '../services/db.service';
import { SuccessPingResponse } from '../types';

const mockDBService = {};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [DBService],
    })
      .overrideProvider(DBService)
      .useValue(mockDBService)
      .compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
    it('should pong', () => {
      const result = appController.ping();
      expect(result).toEqual<SuccessPingResponse>({
        message: expect.any(String),
      });
    });
  });
});
