import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { DBService } from '../services/db.service';
import {
  SubscriptionBodyDto,
  SubscriptionParamDto,
} from '../models/SubscriptionDto';
import { AuthHeader, SubscriptionToTopicSuccessResponse } from '../types';

const TOPIC = 'kianoisawesome';
const URL = 'https://google.com';
const API_KEY = 'xkxjs-isk';

const mockDBService = {
  subscribeTopic: jest.fn((): SubscriptionToTopicSuccessResponse => {
    return {
      topic: TOPIC,
      url: URL,
    };
  }),
};

describe('Subscription', () => {
  let subscriptionController: SubscriptionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [DBService],
    })
      .overrideProvider(DBService)
      .useValue(mockDBService)
      .compile();
    subscriptionController = app.get<SubscriptionController>(
      SubscriptionController,
    );
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(subscriptionController).toBeDefined();
    });
    it('should subscribe to messages in a topic', async () => {
      const params: SubscriptionParamDto = {
        topic: TOPIC,
      };
      const body: SubscriptionBodyDto = {
        url: URL,
      };
      const headers: AuthHeader = {
        authorization: API_KEY,
      };
      const result = await subscriptionController.subscribe(
        params,
        body,
        headers,
      );
      expect(result).toEqual<SubscriptionToTopicSuccessResponse>({
        topic: params.topic,
        url: body.url,
      });
    });
  });
});
