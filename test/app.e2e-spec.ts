import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SubscriberModule } from '../src/external_subscriber/subscriber.module';
import { DBService } from '../src/services/db.service';
import { isUUID } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let subscriberApp: INestApplication;
  let apiKey = '';

  beforeAll(async () => {
    const appModuleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const subscriberModuleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [SubscriberModule],
      }).compile();

    app = appModuleFixture.createNestApplication();
    subscriberApp = subscriberModuleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    subscriberApp.useGlobalPipes(new ValidationPipe());
    await DBService.initalize();
    await DBService.flush();
    await app.init();
    await subscriberApp.init();
  });

  it('app is defined', () => {
    expect(app).toBeDefined();
  });

  it('subscriberApp is defined', () => {
    expect(subscriberApp).toBeDefined();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('[Subscriber] / (GET)', () => {
    return request(subscriberApp.getHttpServer()).get('/').expect(200);
  });

  it('/generate-api-key (POST)', () => {
    return request(app.getHttpServer())
      .post('/generate-api-key')
      .send({ username: 'kiano' })
      .expect(201)
      .then((response) => {
        apiKey = response.body.apiKey;
        expect(isUUID(apiKey)).toBe(true);
      });
  });

  it('/subscribe/:topic (POST)', () => {
    return request(app.getHttpServer())
      .post('/subscribe/food')
      .set({ authorization: apiKey, Accept: 'application/json' })
      .send({ url: 'http://localhost:9000/test1' })
      .expect(201)
      .then((response) => {
        const { topic, url } = response.body;
        expect(topic).toEqual('food');
        expect(url).toEqual('http://localhost:9000/test1');
      });
  });

  it('/publish/:topic (POST)', () => {
    return request(app.getHttpServer())
      .post('/publish/food')
      .set({ authorization: apiKey, Accept: 'application/json' })
      .send({ message: 'I love food' })
      .expect(201)
      .then(async (response) => {
        expect(response.body.status).toEqual('published');
      });
  });

  afterAll(async () => {
    await DBService.quit();
    await subscriberApp.close();
    await app.close();
  });
});
