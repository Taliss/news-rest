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
    // create is mutating the input to insert Ids, so be carefull!
    const insertedIds = await news.create([{ ...validNews }]);
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
      .send({
        title: 'i am not a valid news record, but id will fail before me',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(
          /fails to match the valid mongo id pattern/
        );
      });
  });

  test('should not pass when partial data is send', async () => {
    await request(app.callback())
      .put(`/api/news/${validId}`)
      .send({
        title: 'missing description and text',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/is required/);
      });
  });

  test('should not pass when extra prop is send', async () => {
    await request(app.callback())
      .put(`/api/news/${validId}`)
      .send({
        foo: 'foo',
        title: 'missing description and text',
        description: 'valid',
        text: '1234567890',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/is not allowed/);
      });
  });

  // same validation as for creating, skipping other test scenarious as this is already tested
  test('should not pass when all props are send, but one or more are invalid', async () => {
    await request(app.callback())
      .put(`/api/news/${validId}`)
      .send({
        title: 'missing description and text',
        description: '1',
        text: '1234567890',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/must be at least/);
      });
  });

  test('should update the record', async () => {
    const newTitle = 'updated title only';
    await request(app.callback())
      .put(`/api/news/${validId}`)
      .send({ ...validNews, title: newTitle })
      .expect(200);

    await request(app.callback())
      .get(`/api/news/${validId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          ...validNews,
          title: newTitle,
          _id: validId,
        });
      });
  });
});

describe('Updating news document with PATCH', () => {
  test('should not pass when invalid id is passed', async () => {
    await request(app.callback())
      .patch(`/api/news/somethingAsAnId`)
      .send({
        title: 'i am not a valid news record',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(
          /fails to match the valid mongo id pattern/
        );
      });
  });

  test('should not pass when extra prop is send', async () => {
    await request(app.callback())
      .patch(`/api/news/${validId}`)
      .send({
        foo: 'foo',
        title: 'please do not update me',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/is not allowed/);
      });
  });

  test('should update the record with partial data send', async () => {
    const newTitle = 'updated title';
    const newDescription = 'updated description';

    await request(app.callback())
      .patch(`/api/news/${validId}`)
      .send({ description: newDescription, title: newTitle })
      .expect(200);

    await request(app.callback())
      .get(`/api/news/${validId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          ...validNews,
          title: newTitle,
          description: newDescription,
          _id: validId,
        });
      });
  });
});
