import { Injectable, ConflictException } from '@nestjs/common';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis/dist/lib/client';
import { PubSubListener } from 'redis/dist/lib/commands-queue';
import { handleException } from '../util';
import { isUUID } from 'class-validator';

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
  private static redisSubscriber: RedisClientType;
  private static REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  private static REDIS_PORT = process.env.REDIS_PORT || 6379;

  static async initalize(): Promise<void> {
    return new Promise((resolve, reject) => {
      DBService.redisClient = createClient({
        url: `redis://${DBService.REDIS_HOST}:${DBService.REDIS_PORT}`,
        socket: {
          keepAlive: 1,
        },
        database: 1,
      });
      // TODO: test maximum number of pulishers and subscribers and client connections
      DBService.redisClient.on('error', (error) => {
        console.log('[redis]', error);
      });
      DBService.redisClient.on('connect', () =>
        console.log('[redis', 'connecting..'),
      );
      DBService.redisClient.on('ready', () => console.log('[redis', 'ready'));
      DBService.redisClient
        .connect()
        .then(() => {
          DBService.redisSubscriber = DBService.redisClient.duplicate();
          return DBService.redisSubscriber.connect();
        })
        .then(resolve)
        .catch(reject);
    });
  }

  async isExistingUser(username: string): Promise<boolean> {
    try {
      const existingUser = await DBService.redisClient.get(`user-${username}`);
      return existingUser !== null;
    } catch (error) {
      handleException(error);
    }
  }

  async isValidApiKey(apiKey: string): Promise<boolean> {
    try {
      if (!isUUID(apiKey)) return false;
      const existingApiKey = await DBService.redisClient.get(
        `apiKey-${apiKey}`,
      );
      return existingApiKey !== null;
    } catch (error) {
      handleException(error);
    }
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

  async subscribeTopic(
    topic: string,
    url: string,
  ): Promise<{ url: string; topic: string }> {
    try {
      await DBService.redisSubscriber.subscribe(
        topic,
        this.subscriptionListener,
      );
      return { url, topic };
    } catch (error) {
      handleException(error);
    }
  }

  async publishTopic(topic: string, body: any): Promise<{ status: string }> {
    try {
      await DBService.redisClient.publish(topic, JSON.stringify(body));
      return { status: 'published' };
    } catch (error) {
      console.log(error);
      handleException(error);
    }
  }

  private async createUser(username: string) {
    try {
      await DBService.redisClient.set(
        `user-${username}`,
        JSON.stringify({
          userId: username,
          createdAt: Date.now(),
          id: uuidv4(),
        }), // TODO: use hSet
      );
    } catch (error) {
      handleException(error);
    }
  }

  private async createUUIDApiKey(username: string): Promise<string> {
    try {
      const apiKey = uuidv4();
      await DBService.redisClient.set(
        `apiKey-${apiKey}`,
        JSON.stringify({ userId: username, createdAt: Date.now() }), // TODO: use hset
      );
      return apiKey;
    } catch (error) {
      handleException(error);
    }
  }

  private subscriptionListener: PubSubListener = (channel, message) => {
    console.log(`[redis]: ${channel} : ${message}`);
  };
}
