const request = require('supertest');
const { establishDBConnection, closeConnection } = require('../../db');
const app = require('../../api/app');
const testData = require('../../test-post-data.json');

beforeAll(async () => {
  await establishDBConnection();
});

afterAll(async () => {
  await closeConnection();
});

describe('Simple test', () => {
  test('test', () => {
    return request(app.callback())
      .post('/api/news')
      .send({ news: testData })
      .expect((res) => {
        console.log(res.body);
      });
  });
});
