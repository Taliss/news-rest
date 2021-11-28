const request = require('supertest');
const app = require('../../api/app');
const news = require('../../api/models/news');
const testData = require('../../test-post-data.json');

const {
  closeConnection,
  getCollection,
  establishDBConnection,
} = require('../../db');

beforeAll(async () => {
  try {
    await establishDBConnection();
    await news.create(testData.map((x) => ({ ...x })));
  } catch (err) {
    console.error('Unable to run tests duo to error while doing test setup');
    throw err;
  }
});

afterAll(async () => {
  await getCollection('news').drop();
  await closeConnection();
});

describe('Fetching list of news records', () => {
  test('should return all news', async () => {
    await request(app.callback())
      .get(`/api/news`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(testData.length);
        expect(res.body[0]).toEqual(expect.objectContaining(testData[0]));
        expect(res.body[0]._id).toEqual(expect.any(String));
        expect(res.body[0]._id).toHaveLength(24);
        expect(res.body[0].date).toEqual(expect.any(String));
      });
  });
});
