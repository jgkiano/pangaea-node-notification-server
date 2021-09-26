import { Injectable } from '@nestjs/common';
import validator from 'validator';
import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';

@Injectable()
export class DBService {
  private static redisClient: RedisClientType;
  private static REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  private static REDIS_PORT = process.env.REDIS_PORT || 6379;

  static async initalize(): Promise<void> {
    return new Promise((resolve, reject) => {
      DBService.redisClient = createClient({
        url: `redis://${DBService.REDIS_HOST}:${DBService.REDIS_PORT}`,
      });
      DBService.redisClient.on('error', reject);
      DBService.redisClient.connect().then(resolve).catch(reject);
    });
  }

  isApiKeyValid(apiKey: string): boolean {
    if (!validator.isUUID(apiKey)) {
      return false;
    }
    return true;
  }
}
