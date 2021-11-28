const request = require('supertest');
const app = require('../../api/app');
const news = require('../../api/models/news');
const {
  closeConnection,
  getCollection,
  establishDBConnection,
} = require('../../db');

const validNews = {
  title: 'test title',
  description: 'test description',
  text: 'test text !',
};
let validId;

beforeAll(async () => {
  try {
    await establishDBConnection();
    // create one item and get the id
    const insertedIds = await news.create([validNews]);
    validId = insertedIds[0];
  } catch (err) {
    console.error('Unable to run tests duo to error while doing test setup');
    throw err;
  }
});

afterAll(async () => {
  await getCollection('news').drop();
  await closeConnection();
});

describe('Updating news document with PUT', () => {
  test('should not pass when invalid id is passed', async () => {
    await request(app.callback())
      .put(`/api/news/somethingAsAnId`)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(
          /fails to match the valid mongo id pattern/
        );
      });
  });

  //   test('should return not found when id is valid, but no record', async () => {
  //     const validMissingId = validId.substring(0, validId.length - 4) + '0000';
  //     await request(app.callback())
  //       .get(`/api/news/${validMissingId}`)
  //       .expect(404)
  //       .expect((res) => {
  //         expect(res.body.message).toEqual('Not Found');
  //       });
  //   });

  //   test('should return valid news record', async () => {
  //     await request(app.callback())
  //       .get(`/api/news/${validId}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body).toEqual(
  //           expect.objectContaining({
  //             title: validNews.title,
  //             description: validNews.description,
  //             text: validNews.text,
  //           })
  //         );
  //         expect(res.body._id).toEqual(validId);
  //         expect(res.body.date).toEqual(expect.any(String));
  //       });
  //   });
});
