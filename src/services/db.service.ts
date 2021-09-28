import { Injectable, ConflictException } from '@nestjs/common';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import { RedisClientType } from 'redis/dist/lib/client';
import { PubSubListener } from 'redis/dist/lib/commands-queue';
import axios from 'axios';
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
  private static DB_USER_PREFIX = 'user-';
  private static DB_TOPIC_PREFIX = 'topic-';
  private static DB_API_KEY_PREFIX = 'apiKey-';

  static async initalize(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        DBService.redisClient = createClient({
          url: `redis://${DBService.REDIS_HOST}:${DBService.REDIS_PORT}`,
        });
        // TODO: test maximum number of pulishers and subscribers and client connections
        DBService.redisClient.on('error', (error) => {
          console.log('[redis]', error);
        });
        DBService.redisClient.on('connect', () =>
          console.log('[redis', 'connecting..'),
        );
        DBService.redisClient.on('ready', () => console.log('[redis', 'ready'));
        await DBService.redisClient.connect();
        DBService.redisSubscriber = DBService.redisClient.duplicate();
        await DBService.redisSubscriber.connect();
        const existingTopics =
          (await DBService.redisClient.keys(`${this.DB_TOPIC_PREFIX}*`)) || [];
        const result = existingTopics.map((topic) =>
          DBService.redisSubscriber.subscribe(
            topic,
            DBService.subscriptionListener,
          ),
        );
        await Promise.all(result);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async isExistingUser(username: string): Promise<boolean> {
    try {
      const key = `${DBService.DB_USER_PREFIX}${username}`;
      const exists = await DBService.redisClient.exists(key);
      return exists;
    } catch (error) {
      handleException(error);
    }
  }

  async isValidApiKey(apiKey: string): Promise<boolean> {
    try {
      const key = `${DBService.DB_API_KEY_PREFIX}${apiKey}`;
      if (!isUUID(apiKey)) return false;
      const exists = await DBService.redisClient.exists(key);
      return exists;
    } catch (error) {
      handleException(error);
    }
  }

  async createApiKey(username: string) {
    try {
      if (await this.isExistingUser(username)) {
        throw new ConflictException('user already exists');
      }
      const userId = await this.createUser(username);
      return await this.createUUIDApiKey(userId);
    } catch (error) {
      handleException(error);
    }
  }

  async subscribeTopic(data: {
    topic: string;
    url: string;
    apiKey: string;
  }): Promise<{ url: string; topic: string }> {
    try {
      const key = `${DBService.DB_TOPIC_PREFIX}${data.topic}`;
      await DBService.redisClient.sAdd(key, data.url);
      await DBService.redisClient.sAdd(data.apiKey, data.url); // keeps track of apiKeys <=> urls[]
      await DBService.redisSubscriber.subscribe(
        key,
        DBService.subscriptionListener,
      );
      return data;
    } catch (error) {
      console.log(error);
      handleException(error);
    }
  }

  async unsubscribeTopic(data: { topic: string; url: string; apiKey: string }) {
    try {
      const ownsUrl = await DBService.redisClient.sIsMember(
        data.apiKey,
        data.url,
      );
      if (ownsUrl) {
        const key = `${DBService.DB_TOPIC_PREFIX}${data.topic}`;
        await DBService.redisClient.sRem(key, data.url);
      }
      return { status: 'unsubscribed' };
    } catch (error) {}
  }

  async publishTopic(data: {
    topic: string;
    body: any;
  }): Promise<{ status: 'published' }> {
    try {
      const key = `${DBService.DB_TOPIC_PREFIX}${data.topic}`;
      await DBService.redisClient.publish(key, JSON.stringify(data.body));
      return { status: 'published' };
    } catch (error) {
      handleException(error);
    }
  }

  private async createUser(username: string) {
    try {
      const key = `${DBService.DB_USER_PREFIX}${username}`;
      const userId = uuidv4();
      await DBService.redisClient.hSet(key, 'username', username);
      await DBService.redisClient.hSet(key, 'createdAt', Date.now().toString());
      await DBService.redisClient.hSet(key, 'id', userId);
      return userId;
    } catch (error) {
      throw error;
    }
  }

  private async createUUIDApiKey(userId: string): Promise<string> {
    try {
      const apiKey = uuidv4();
      const key = `${DBService.DB_API_KEY_PREFIX}${apiKey}`;
      await DBService.redisClient.hSet(key, 'userId', userId);
      await DBService.redisClient.hSet(key, 'createdAt', Date.now().toString());
      return apiKey;
    } catch (error) {
      throw error;
    }
  }

  private static subscriptionListener: PubSubListener = async (
    message,
    topic,
  ) => {
    try {
      console.log(`[redis]: ${topic} : ${message}`);
      const urls = (await DBService.redisClient.sMembers(topic)) || [];
      const result = urls.map((url) =>
        DBService.transmitMessage({ topic, data: JSON.parse(message), url }),
      );
      Promise.all(result);
    } catch (error) {
      console.log(error); //TODO: handle error tracking
    }
  };

  private static transmitMessage = async (transmission: {
    url: string;
    data: {
      [key: string]: any;
    };
    topic: string;
  }) => {
    const { data, topic, url } = transmission;
    console.log(`[transmitting]: ${url}, ${topic}, ${data}`);
    // return axios.post(url, { topic, message });
  };
}
