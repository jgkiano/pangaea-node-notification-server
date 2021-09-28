import { Test, TestingModule } from '@nestjs/testing';
import { PublishController } from './publish.controller';
import { DBService } from '../services/db.service';
import {
  PublishTopicBodyDto,
  PublishTopicParamDto,
} from '../models/PublishTopicDto';
import { PublishToTopicSuccessResponse } from '../types';

const mockDBService = {
  publishTopic: jest.fn((): PublishToTopicSuccessResponse => {
    return { status: 'published' };
  }),
};

describe('PublishController', () => {
  let publishController: PublishController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PublishController],
      providers: [DBService],
    })
      .overrideProvider(DBService)
      .useValue(mockDBService)
      .compile();
    publishController = app.get<PublishController>(PublishController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(publishController).toBeDefined();
    });
    it('should publish message to a topic', async () => {
      const params: PublishTopicParamDto = {
        topic: 'kianoisawesome',
      };
      const body: PublishTopicBodyDto = {
        foo: 'bar',
      };
      const result = await publishController.publish(params, body);
      expect(result).toEqual<PublishToTopicSuccessResponse>({
        status: expect.any(String),
      });
    });
  });
});
