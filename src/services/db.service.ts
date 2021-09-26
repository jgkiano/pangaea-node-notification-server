import { Injectable, ConflictException } from '@nestjs/common';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis/dist/lib/client';
import { handleException } from '../util';
/**
 * redis states:
 * connect: re-connecting
 * ready: re-connection was successful
 * reconnecting: re-connecting
 * error: connection lost
 * end: force kill redis
 * quit: safe terminate redis
 */

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
      DBService.redisClient.on('error', console.log);
      DBService.redisClient.on('connect', () =>
        console.log('[redis]: connect...'),
      );
      DBService.redisClient.on('ready', () => console.log('[redis]: ready...'));
      DBService.redisClient.connect().then(resolve).catch(reject);
    });
  }

  async isValidApiKey(apiKey: string): Promise<boolean> {
    const existingApiKey = await DBService.redisClient.get(`apiKey-${apiKey}`);
    return typeof existingApiKey === 'string';
  }

  async createApiKey(username: string) {
    try {
      if (await this.isExistingUser(username)) {
        throw new ConflictException('user already exists');
      }
      await this.createUser(username);
      return await this.createUUIDApiKey(username);
    } catch (error) {
      handleException(error);
    }
  }

  private async createUser(username: string) {
    try {
      await DBService.redisClient.set(
        `user-${username}`,
        JSON.stringify({ username, createdAt: Date.now(), id: uuidv4() }),
      );
    } catch (error) {
      handleException(error);
    }
  }

  private async createUUIDApiKey(username: string): Promise<string> {
    try {
      const apiKey = uuidv4();
      await DBService.redisClient.set(
        `apiKey-${username}`,
        JSON.stringify({ userId: username, createdAt: Date.now(), apiKey }),
      );
      return apiKey;
    } catch (error) {
      handleException(error);
    }
  }

  private async isExistingUser(username: string) {
    try {
      const existingUser = await DBService.redisClient.get(`user-${username}`);
      return typeof existingUser === 'string';
    } catch (error) {
      return null; // TODO: check if redis connection issue
    }
  }
}
