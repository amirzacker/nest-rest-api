import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  const productData = [
    { id: 1, name: 'test', price: '20.00' },
    { id: 2, name: 'testz', price: '20.00' },
    { id: 3, name: 'tests tes', price: '20.00' },
    { id: 4, name: 'testsss', price: '20.00' },
    { id: 5, name: 'testsss', price: '209.00' },
  ];
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect(productData);
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ name: 'test', price: '20.00' })
      .expect(201)
      .expect({ id: 1, name: 'test', price: '20.00' });
  });
});
